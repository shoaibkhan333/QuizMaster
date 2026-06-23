const express = require('express');
const { Result, Quiz, User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's results
router.get('/my-results', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows: results } = await Result.findAndCountAll({
      where: { userId: req.user.userId },
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'category', 'difficulty']
      }],
      order: [['completedAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      results,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get result by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id, {
      include: [
        {
          model: Quiz,
          as: 'quiz'
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (result.userId !== parseInt(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard for a quiz
router.get('/quiz/:quizId/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await Result.findAll({
      where: { quizId: req.params.quizId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }],
      order: [
        ['percentage', 'DESC'],
        ['timeTaken', 'ASC']
      ],
      limit: parseInt(limit)
    });

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get global leaderboard
router.get('/leaderboard/global', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await User.findAll({
      attributes: ['id', 'username', 'totalQuizzesTaken', 'averageScore'],
      order: [['averageScore', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
