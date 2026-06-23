const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));
app.use('/api/users', require('./routes/users'));

// Serve React static files from client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Database connection and sync
async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ MySQL Connected to database:', process.env.DB_NAME || 'quizapp');
    
    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: false, force: false });
    console.log('✅ Database tables synced successfully');
    console.log('📊 Tables created: users, quizzes, results');
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    console.error('💡 Make sure:');
    console.error('   1. MySQL is running');
    console.error('   2. Database "quizapp" exists');
    console.error('   3. .env file has correct DB credentials');
    process.exit(1);
  }
}

initializeDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz App API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

