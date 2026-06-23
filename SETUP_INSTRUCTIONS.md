# Quick Setup Instructions

## ✅ Database Created
You've successfully created the `quizapp` database in phpMyAdmin!

## Next Steps

### 1. Create `.env` file in the root directory

Create a file named `.env` in the root folder (`QUIZ1/.env`) with the following content:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quizapp
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** 
- If your MySQL root user has a password, add it to `DB_PASSWORD`
- If no password, leave `DB_PASSWORD` empty (as shown above)

### 2. Install Dependencies

```bash
npm install
cd client
npm install
cd ..
```

Or use:
```bash
npm run install-all
```

### 3. Run the Application

```bash
npm run dev
```

### 4. What Happens Next

When you run the app, Sequelize will **automatically**:
- ✅ Connect to your MySQL database
- ✅ Create the following tables:
  - `users` - User accounts
  - `quizzes` - Quiz data
  - `results` - Quiz results
- ✅ Set up all relationships and foreign keys

**You don't need to create tables manually!** They will be created automatically.

### 5. Verify in phpMyAdmin

After running the app, refresh phpMyAdmin and you should see:
- `users` table
- `quizzes` table  
- `results` table

## Troubleshooting

**Connection Error?**
- Check MySQL is running
- Verify database name is `quizapp`
- Check `.env` file credentials

**Tables not created?**
- Check console for error messages
- Verify database user has CREATE privileges
- Make sure database `quizapp` exists

## Ready to Go! 🚀

Once you see "✅ Database tables synced successfully" in the console, your app is ready to use!

