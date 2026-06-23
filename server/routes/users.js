const express = require('express');
const { User, Result, Quiz } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's quizzes
    const quizzes = await Quiz.findAll({
      where: { createdBy: req.params.id },
      attributes: ['id', 'title', 'category', 'difficulty', 'totalAttempts']
    });
    
    // Get recent results
    const recentResults = await Result.findAll({
      where: { userId: req.params.id },
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'category']
      }],
      order: [['completedAt', 'DESC']],
      limit: 5
    });

    res.json({
      user,
      quizzes,
      recentResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const totalQuizzes = await Quiz.count({ where: { createdBy: userId } });
    const totalResults = await Result.count({ where: { userId } });
    const results = await Result.findAll({
      where: { userId },
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'category']
      }]
    });
    
    const totalScore = results.reduce((sum, r) => sum + parseFloat(r.score), 0);
    const totalPoints = results.reduce((sum, r) => sum + parseFloat(r.totalPoints), 0);
    const averageScore = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    
    const categoryStats = {};
    results.forEach(result => {
      const category = result.quiz?.category || 'Unknown';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, totalScore: 0, totalPoints: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].totalScore += parseFloat(result.score);
      categoryStats[category].totalPoints += parseFloat(result.totalPoints);
    });

    Object.keys(categoryStats).forEach(cat => {
      const stats = categoryStats[cat];
      stats.average = stats.totalPoints > 0 ? (stats.totalScore / stats.totalPoints) * 100 : 0;
    });

    res.json({
      totalQuizzes,
      totalResults,
      averageScore: Math.round(averageScore * 100) / 100,
      categoryStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
