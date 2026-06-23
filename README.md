# QuizMaster - Comprehensive Quiz Application

A full-featured quiz application built for Final Year Project (FYP) with modern web technologies. This application allows users to create, take, and manage quizzes with comprehensive analytics and leaderboards.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Quiz Creation**: Create quizzes with multiple question types
- **Quiz Taking**: Interactive quiz interface with timer
- **Results & Analytics**: Detailed performance tracking and statistics
- **Leaderboards**: Global and quiz-specific leaderboards
- **Categories & Filtering**: Organize quizzes by category and difficulty
- **Search Functionality**: Find quizzes quickly with search

### Question Types
- Multiple Choice Questions (MCQ)
- True/False Questions
- Short Answer Questions

### Advanced Features
- Real-time timer during quiz taking
- Progress tracking with visual indicators
- Detailed result review with explanations
- User profile with statistics
- Quiz statistics (attempts, average scores)
- Responsive design for all devices
- Modern, beautiful UI with Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM for MySQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher, local installation or cloud MySQL service)

## 🔧 Installation & Setup

### 1. Clone or Navigate to Project Directory
```bash
cd QUIZ1
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 4. Environment Configuration

Create a `.env` file in the root directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quizapp
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For Cloud MySQL (e.g., AWS RDS, PlanetScale, etc.):**
```env
DB_HOST=your-db-host.rds.amazonaws.com
DB_PORT=3306
DB_NAME=quizapp
DB_USER=your_username
DB_PASSWORD=your_password
```

### 5. Setup MySQL Database

**Local MySQL:**
1. Install MySQL from https://dev.mysql.com/downloads/mysql/
2. Start MySQL service:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS (Homebrew)
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```
3. Create database:
   ```bash
   mysql -u root -p
   CREATE DATABASE quizapp;
   EXIT;
   ```

**Cloud MySQL:** Use your provider's connection details in `.env`

### 6. Run the Application

**Development Mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
QUIZ1/
├── server/
│   ├── index.js              # Main server file
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Result.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── quizzes.js
│   │   ├── results.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js           # Authentication middleware
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── Layout/
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## 🎯 Usage Guide

### For Users

1. **Register/Login**: Create an account or login to existing account
2. **Browse Quizzes**: Explore available quizzes with filters
3. **Take Quiz**: Click on a quiz to view details and start
4. **View Results**: Check your performance and review answers
5. **View Profile**: See your statistics and progress
6. **Leaderboard**: Check your ranking globally or per quiz

### For Quiz Creators

1. **Create Quiz**: Click "Create Quiz" in navigation
2. **Add Questions**: Add multiple questions with different types
3. **Set Options**: Configure time limit, difficulty, category
4. **Publish**: Make quiz public or keep it private
5. **Manage**: Edit or delete your quizzes
6. **Analytics**: View quiz statistics and attempts

## 🔐 API Endpoints

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

## 🎨 Features in Detail

### Quiz Creation
- Add unlimited questions
- Multiple question types
- Set points per question
- Add explanations
- Configure time limits
- Set difficulty levels
- Organize by categories

### Quiz Taking
- Real-time countdown timer
- Question navigation
- Progress indicator
- Answer review before submission
- Auto-submit on time expiry

### Results & Analytics
- Score percentage
- Points earned
- Time taken
- Question-by-question review
- Correct/incorrect indicators
- Answer explanations

### User Statistics
- Total quizzes created
- Total quizzes taken
- Average score
- Performance by category
- Recent results

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (usually auto-set)

2. Update CORS settings if needed

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder

3. Set API URL in environment variables

## 🐛 Troubleshooting

### MySQL Connection Issues
- Ensure MySQL is running locally
- Check database credentials in `.env`
- Verify database exists: `CREATE DATABASE quizapp;`
- Check MySQL user permissions
- Verify network access for cloud MySQL

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change port in `vite.config.js` for frontend

### CORS Errors
- Ensure backend CORS is configured
- Check API URL in frontend

## 📝 Future Enhancements

Potential features for expansion:
- Image support in questions
- Quiz sharing via links
- Email notifications
- Quiz templates
- Advanced analytics dashboard
- Social features (comments, ratings)
- Quiz scheduling
- Export results to PDF
- Dark mode
- Multi-language support

## 👨‍💻 Development

### Adding New Features

1. Backend: Add routes in `server/routes/`
2. Frontend: Add pages in `client/src/pages/`
3. Update models if needed in `server/models/`

### Code Style
- Use consistent formatting
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

## 📄 License

This project is created for educational purposes as a Final Year Project.

## 👥 Author

Created as part of Final Year Project (FYP)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend
- MongoDB for flexible database
- Tailwind CSS for beautiful styling
- All open-source contributors

---

**Happy Quizzing! 🎓**

