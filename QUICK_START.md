# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### Step 2: Setup MySQL Database
1. Install MySQL if not already installed
2. Create database:
```bash
mysql -u root -p
CREATE DATABASE quizapp;
EXIT;
```

### Step 3: Setup Environment
Create a `.env` file in the root directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quizapp
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-secret-key-here
```

### Step 4: Start MySQL
**Windows:**
```bash
net start MySQL80
```

**macOS/Linux:**
```bash
sudo systemctl start mysql
```

### Step 5: Run the Application
```bash
npm run dev
```

### Step 6: Open Browser
Navigate to: **http://localhost:3000**

## 🎯 First Steps

1. **Register** a new account
2. **Create** your first quiz
3. **Take** a quiz to test it
4. **View** your results and statistics

## 📚 Need Help?

Check the full [README.md](README.md) for detailed documentation.

