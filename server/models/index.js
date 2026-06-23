const sequelize = require('../config/database');
const User = require('./User');
const Quiz = require('./Quiz');
const Result = require('./Result');

// Define associations
User.hasMany(Quiz, { foreignKey: 'createdBy', as: 'quizzes' });
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Result, { foreignKey: 'userId', as: 'results' });
Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Quiz.hasMany(Result, { foreignKey: 'quizId', as: 'results' });
Result.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

module.exports = {
  sequelize,
  User,
  Quiz,
  Result
};

