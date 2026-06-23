const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { Quiz, Result, User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Optional auth - extracts user info if token exists, but doesn't fail if it doesn't
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      req.user = decoded;
    }
  } catch (error) {
    // Token invalid or missing - that's okay, we'll continue without user
    req.user = null;
  }
  next();
};

// Helper function to hide correct answers
const hideCorrectAnswers = (quiz) => {
  if (!quiz) return quiz;
  const quizData = quiz.toJSON ? quiz.toJSON() : quiz;

  // Normalize questions to an array (DB may return JSON as string)
  if (typeof quizData.questions === 'string') {
    try {
      quizData.questions = JSON.parse(quizData.questions);
    } catch (err) {
      console.error('Failed to parse quiz questions JSON:', err?.message);
      quizData.questions = [];
    }
  }

  if (!Array.isArray(quizData.questions)) return quizData;

  quizData.questions = quizData.questions.map((q) => {
    if (q.options && Array.isArray(q.options)) {
      q.options = q.options.map((opt) => {
        const { isCorrect, ...option } = opt;
        return option;
      });
    }
    return q;
  });

  return quizData;
};

// Get all public quizzes with filters (and private quizzes if user is authenticated creator)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 100 } = req.query;
    
    // Build base visibility condition: public quizzes OR private quizzes created by current user
    const visibilityConditions = [{ isPublic: true }];
    
    // If user is authenticated, also include their private quizzes
    if (req.user && req.user.userId) {
      visibilityConditions.push({
        [Op.and]: [
          { isPublic: false },
          { createdBy: parseInt(req.user.userId) }
        ]
      });
    }
    
    // Build where clause with all conditions
    const where = {
      [Op.and]: [
        { [Op.or]: visibilityConditions }
      ]
    };

    // Add category filter
    if (category) {
      where[Op.and].push({ category: category });
    }

    // Add difficulty filter
    if (difficulty) {
      where[Op.and].push({ difficulty: difficulty });
    }

    // Add search filter
    if (search) {
      where[Op.and].push({
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      });
    }

    const { count, rows: quizzes } = await Quiz.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    const quizzesWithoutAnswers = quizzes.map(quiz => hideCorrectAnswers(quiz));

    res.json({
      quizzes: quizzesWithoutAnswers,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single quiz (without correct answers)
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(hideCorrectAnswers(quiz));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz with answers (for results)
router.get('/:id/with-answers', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Only show answers if user created the quiz or completed it
    const result = await Result.findOne({
      where: {
        userId: parseInt(req.user.userId),
        quizId: parseInt(req.params.id)
      }
    });
    
    const isCreator = quiz.createdBy === parseInt(req.user.userId);

    // Allow access if user is creator OR has completed the quiz
    if (!isCreator && !result) {
      return res.status(403).json({ message: 'You must complete the quiz first to view answers' });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create quiz
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate questions
    const questions = req.body.questions || [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.questionText.trim()) {
        return res.status(400).json({ 
          message: `Question ${i + 1} must have question text` 
        });
      }
      if (q.questionType === 'multiple-choice' || q.questionType === 'true-false') {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have at least 2 options` 
          });
        }
        const hasCorrect = q.options.some(opt => opt.isCorrect === true);
        if (!hasCorrect) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have at least one correct option` 
          });
        }
      } else if (q.questionType === 'short-answer') {
        if (!q.correctAnswer || !q.correctAnswer.trim()) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have a correct answer` 
          });
        }
      }
    }

    const quizData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const quiz = await Quiz.create(quizData);

    // Reload with associations
    const createdQuiz = await Quiz.findByPk(quiz.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quiz
router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.createdBy !== parseInt(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await quiz.update(req.body);

    const updatedQuiz = await Quiz.findByPk(quiz.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });

    res.json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.createdBy !== parseInt(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await quiz.destroy();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories (including from private quizzes if user is authenticated creator)
router.get('/meta/categories', optionalAuth, async (req, res) => {
  try {
    // Build visibility condition: public quizzes OR private quizzes created by current user
    const visibilityConditions = [{ isPublic: true }];
    
    // If user is authenticated, also include their private quizzes
    if (req.user && req.user.userId) {
      visibilityConditions.push({
        [Op.and]: [
          { isPublic: false },
          { createdBy: parseInt(req.user.userId) }
        ]
      });
    }
    
    const quizzes = await Quiz.findAll({
      where: {
        [Op.or]: visibilityConditions
      },
      attributes: ['category'],
      group: ['category']
    });
    const categories = [...new Set(quizzes.map(q => q.category))];
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({ 
        message: 'Quiz not found. Please check the quiz ID and try again.' 
      });
    }

    // Parse questions if it's stored as a JSON string
    let questions = quiz.questions;
    if (typeof questions === 'string') {
      try {
        questions = JSON.parse(questions);
      } catch (parseError) {
        console.error('Error parsing quiz questions:', parseError);
        return res.status(500).json({ 
          message: 'Unable to process quiz questions. Please contact the quiz creator or try again later.' 
        });
      }
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ 
        message: 'This quiz appears to be incomplete and has no questions available. Please contact the quiz creator or try a different quiz.' 
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        message: 'No answers were provided. Please answer at least one question before submitting.' 
      });
    }

    let score = 0;
    let totalPoints = 0;
    const answerResults = [];

    questions.forEach((question, index) => {
      const questionPoints = question.points || 1;
      totalPoints += questionPoints;
      const userAnswer = answers[index]?.answer || '';
      let isCorrect = false;
      let pointsEarned = 0;

      if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
        if (!question.options || !Array.isArray(question.options)) {
          // Skip invalid questions
          answerResults.push({
            questionId: index,
            userAnswer,
            isCorrect: false,
            pointsEarned: 0
          });
          return;
        }
        const selectedOption = question.options.find(opt => opt.text === userAnswer);
        isCorrect = selectedOption?.isCorrect || false;
      } else if (question.questionType === 'short-answer') {
        const correctAnswer = question.correctAnswer || '';
        isCorrect = correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
      }

      if (isCorrect) {
        pointsEarned = questionPoints;
        score += questionPoints;
      }

      answerResults.push({
        questionId: index,
        userAnswer,
        isCorrect,
        pointsEarned
      });
    });

    const percentage = (score / totalPoints) * 100;

    // Save result
    const result = await Result.create({
      userId: req.user.userId,
      quizId: quiz.id,
      answers: answerResults,
      score,
      totalPoints,
      percentage,
      timeTaken
    });

    // Update quiz statistics
    const newTotalAttempts = quiz.totalAttempts + 1;
    const currentAvg = parseFloat(quiz.averageScore || 0);
    const newAverageScore = ((currentAvg * (quiz.totalAttempts)) + percentage) / newTotalAttempts;
    await quiz.update({
      totalAttempts: newTotalAttempts,
      averageScore: Math.round(newAverageScore * 100) / 100
    });

    // Update user statistics
    const user = await User.findByPk(req.user.userId);
    const newTotalQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
    const currentTotalScore = parseFloat(user.totalScore || 0);
    const newTotalScore = currentTotalScore + score;
    // Calculate average based on all results
    const allResults = await Result.findAll({ where: { userId: req.user.userId } });
    const totalPointsFromAllResults = allResults.reduce((sum, r) => sum + parseFloat(r.totalPoints || 0), 0);
    const totalScoreFromAllResults = allResults.reduce((sum, r) => sum + parseFloat(r.score || 0), 0);
    const newUserAverageScore = totalPointsFromAllResults > 0 
      ? (totalScoreFromAllResults / totalPointsFromAllResults) * 100 
      : 0;
    
    await user.update({
      totalQuizzesTaken: newTotalQuizzesTaken,
      totalScore: newTotalScore,
      averageScore: Math.round(newUserAverageScore * 100) / 100
    });

    // Reload result with associations
    const savedResult = await Result.findByPk(result.id, {
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'category']
      }]
    });

    res.json({
      result: savedResult,
      score,
      totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      timeTaken,
      answers: answerResults
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ 
      message: 'An error occurred while processing your quiz submission. Please try again or contact support if the problem persists.' 
    });
  }
});

module.exports = router;
