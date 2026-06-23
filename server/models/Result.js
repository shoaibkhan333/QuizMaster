const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  score: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalPoints: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Time taken in seconds'
  }
}, {
  tableName: 'results',
  timestamps: true,
  createdAt: 'completedAt',
  updatedAt: false,
  indexes: [
    {
      fields: ['userId', 'quizId']
    },
    {
      fields: ['userId', 'completedAt']
    }
  ]
});

module.exports = Result;
