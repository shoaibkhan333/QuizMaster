# Project Review & Run Instructions

## 📋 Project Overview

**QuizMaster** is a full-stack quiz application built as a Final Year Project (FYP). It's a comprehensive web application that allows users to create, take, and manage quizzes with analytics and leaderboards.

### Technology Stack

**Backend:**
- Node.js with Express.js
- MySQL database (via Sequelize ORM)
- JWT authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Icons

### Project Structure

```
QUIZ1/
├── server/                 # Backend Node.js/Express application
│   ├── config/
│   │   └── database.js     # Sequelize MySQL configuration
│   ├── models/             # Database models (User, Quiz, Result)
│   ├── routes/             # API routes (auth, quizzes, results, users)
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   └── index.js            # Main server file
│
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page components (Home, Login, QuizList, etc.)
│   │   ├── App.jsx         # Main app component with routing
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── vite.config.js      # Vite configuration
│
├── package.json            # Root package.json with scripts
└── README.md              # Project documentation
```

## 🎯 Key Features

1. **User Authentication**
   - Registration and login
   - JWT-based session management
   - Protected routes

2. **Quiz Management**
   - Create quizzes with multiple question types (MCQ, True/False, Short Answer)
   - Set time limits, difficulty, categories
   - Public/private quiz options

3. **Quiz Taking**
   - Interactive quiz interface
   - Real-time countdown timer
   - Progress tracking
   - Auto-submit on time expiry

4. **Results & Analytics**
   - Detailed result review
   - Score calculation
   - Question-by-question feedback
   - Performance statistics

5. **Leaderboards**
   - Global leaderboard
   - Quiz-specific leaderboards
   - User rankings

6. **User Profile**
   - Personal statistics
   - Quiz history
   - Performance metrics

## 🚀 How to Run the Project

### Prerequisites

Before running, ensure you have:
- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **MySQL** (v5.7 or higher) - Already installed via XAMPP
- ✅ **npm** (comes with Node.js)

### Step-by-Step Setup

#### 1. Verify MySQL is Running

Since you're using XAMPP, ensure MySQL is running:
- Open XAMPP Control Panel
- Start MySQL service
- Or verify via phpMyAdmin: http://localhost/phpmyadmin

#### 2. Create Database (if not already created)

**Option A: Via phpMyAdmin**
1. Open http://localhost/phpmyadmin
2. Click "New" in the left sidebar
3. Database name: `quizapp`
4. Collation: `utf8mb4_general_ci`
5. Click "Create"

**Option B: Via MySQL Command Line**
```bash
mysql -u root -p
CREATE DATABASE quizapp;
EXIT;
```

#### 3. Create Environment File

Create a `.env` file in the root directory (`QUIZ1/.env`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quizapp
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**Important Notes:**
- If your MySQL root user has a password, add it to `DB_PASSWORD`
- If no password (default XAMPP), leave `DB_PASSWORD` empty
- Change `JWT_SECRET` to a random secure string

#### 4. Install Dependencies

**Install root dependencies:**
```bash
npm install
```

**Install client dependencies:**
```bash
cd client
npm install
cd ..
```

**Or use the convenience script:**
```bash
npm run install-all
```

#### 5. Run the Application

**Option A: Run Both Server and Client Together (Recommended)**
```bash
npm run dev
```

This will start:
- Backend server on: http://localhost:5000
- Frontend client on: http://localhost:3000

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

#### 6. Access the Application

Once running, open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health (health check)

### What Happens on First Run

When you start the server for the first time:
1. ✅ Sequelize connects to MySQL database
2. ✅ Automatically creates tables: `users`, `quizzes`, `results`
3. ✅ Sets up relationships and foreign keys
4. ✅ No manual table creation needed!

You should see in the console:
```
✅ MySQL Connected to database: quizapp
✅ Database tables synced successfully
📊 Tables created: users, quizzes, results
🚀 Server running on port 5000
```

## 🧪 Testing the Application

### 1. Register a New Account
- Go to http://localhost:3000
- Click "Register" or navigate to `/register`
- Fill in username, email, and password
- Submit the form

### 2. Create a Quiz
- After logging in, click "Create Quiz" in the navigation
- Fill in quiz details:
  - Title: "My First Quiz"
  - Description: "A test quiz"
  - Category: "General Knowledge"
  - Difficulty: "Easy"
  - Time Limit: 10 minutes
- Add questions:
  - Click "Add Question"
  - Select question type (MCQ, True/False, or Short Answer)
  - Enter question text, options, correct answer
  - Set points for each question
- Click "Create Quiz"

### 3. Take a Quiz
- Browse quizzes at `/quizzes`
- Click on a quiz to view details
- Click "Start Quiz"
- Answer questions within the time limit
- Submit when done (or auto-submit when time expires)

### 4. View Results
- After submitting, you'll see your results
- Navigate to `/results` to see all your quiz results
- Click on a result to see detailed review

### 5. Check Leaderboard
- Navigate to `/leaderboard`
- View global leaderboard or quiz-specific rankings

### 6. View Profile
- Click on your profile in the navigation
- See your statistics:
  - Total quizzes taken
  - Average score
  - Recent results

## 🔍 Verification Checklist

After running, verify:

- [ ] MySQL is running (check XAMPP Control Panel)
- [ ] Database `quizapp` exists (check phpMyAdmin)
- [ ] `.env` file exists with correct credentials
- [ ] Dependencies installed (no errors in console)
- [ ] Server starts without errors (port 5000)
- [ ] Client starts without errors (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can create a quiz
- [ ] Can take a quiz
- [ ] Can view results

## 🐛 Troubleshooting

### MySQL Connection Error

**Error:** `❌ Database Error: Access denied for user 'root'@'localhost'`

**Solution:**
- Check MySQL password in `.env` file
- If XAMPP default (no password), leave `DB_PASSWORD=` empty
- Verify MySQL is running in XAMPP

**Error:** `❌ Database Error: Unknown database 'quizapp'`

**Solution:**
- Create database: `CREATE DATABASE quizapp;`
- Or create via phpMyAdmin

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
- Change `PORT` in `.env` to another port (e.g., `5001`)
- Update `vite.config.js` proxy target if needed

**Error:** `Port 3000 is already in use`

**Solution:**
- Vite will automatically use the next available port
- Or change port in `client/vite.config.js`

### Dependencies Installation Issues

**Error:** `npm ERR!` during installation

**Solution:**
- Delete `node_modules` folders
- Delete `package-lock.json` files
- Run `npm install` again
- Ensure Node.js version is 16+

### Tables Not Created

**Error:** Tables don't appear in phpMyAdmin

**Solution:**
- Check console for error messages
- Verify database user has CREATE privileges
- Ensure database `quizapp` exists
- Check `.env` file credentials

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Backend CORS is already configured in `server/index.js`
- Ensure backend is running on port 5000
- Check `vite.config.js` proxy configuration

## 📊 Database Schema

The application uses three main tables:

### `users`
- `id` (Primary Key, Auto Increment)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `role` (user/admin)
- `totalQuizzesTaken`
- `totalScore`
- `averageScore`

### `quizzes`
- `id` (Primary Key, Auto Increment)
- `title`
- `description`
- `category`
- `difficulty` (easy/medium/hard)
- `questions` (JSON array)
- `timeLimit` (minutes)
- `totalPoints`
- `createdBy` (Foreign Key → users.id)
- `isPublic` (boolean)

### `results`
- `id` (Primary Key, Auto Increment)
- `userId` (Foreign Key → users.id)
- `quizId` (Foreign Key → quizzes.id)
- `score`
- `totalPoints`
- `percentage`
- `timeTaken` (seconds)
- `answers` (JSON array)
- `completedAt` (timestamp)

## 🎨 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Quizzes
- `GET /api/quizzes` - Get all public quizzes (with filters)
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create quiz (protected)
- `PUT /api/quizzes/:id` - Update quiz (protected)
- `DELETE /api/quizzes/:id` - Delete quiz (protected)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (protected)
- `GET /api/quizzes/meta/categories` - Get all categories

### Results
- `GET /api/results/my-results` - Get user's results (protected)
- `GET /api/results/:id` - Get specific result (protected)
- `GET /api/results/quiz/:quizId/leaderboard` - Get quiz leaderboard
- `GET /api/results/leaderboard/global` - Get global leaderboard

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/stats` - Get user statistics

## 📝 Development Scripts

Available npm scripts (from root `package.json`):

- `npm run dev` - Run both server and client concurrently
- `npm run server` - Run backend server only
- `npm run client` - Run frontend client only
- `npm run install-all` - Install dependencies for both root and client
- `npm run build` - Build frontend for production
- `npm start` - Run production server

## ✅ Project Status

**Current State:**
- ✅ Full-stack application structure
- ✅ MySQL database integration
- ✅ User authentication system
- ✅ Quiz CRUD operations
- ✅ Quiz taking functionality
- ✅ Results and analytics
- ✅ Leaderboard system
- ✅ Responsive UI with Tailwind CSS
- ✅ Protected routes
- ✅ Error handling

**Ready to Use:**
The project is fully functional and ready to run. Just follow the setup steps above!

---

## 🎓 Summary

This is a well-structured, production-ready quiz application with:
- Modern tech stack (React + Node.js + MySQL)
- Complete authentication system
- Full CRUD operations for quizzes
- Comprehensive results tracking
- Beautiful, responsive UI
- Proper error handling and validation

**To get started:** Follow the "Step-by-Step Setup" section above, and you'll have the application running in minutes!











