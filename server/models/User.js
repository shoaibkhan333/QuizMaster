const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  totalQuizzesTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalScore: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  averageScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  const storedPassword = this.password || '';

  // If password looks like a bcrypt hash (starts with $2), compare using bcrypt
  if (storedPassword.startsWith('$2')) {
    return await bcrypt.compare(candidatePassword, storedPassword);
  }

  // Fallback: handle legacy plain-text passwords
  const isMatch = candidatePassword === storedPassword;

  // If it matches, upgrade to a hashed password transparently
  if (isMatch && candidatePassword) {
    this.password = await bcrypt.hash(candidatePassword, 10);
    await this.save();
  }

  return isMatch;
};

module.exports = User;
