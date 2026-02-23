# 🎓 TutorTrack - Tutor-student Management System

A beautiful, modern Tutor-student management dashboard with MongoDB backend.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm run setup

# 2. Make sure MongoDB is running
# (Windows: Check Services → MongoDB should be Running)

# 3. Add your logo
# Place logo.png in frontend/ folder

# 4. Start the server
npm start

# 5. Open browser
# Navigate to: http://localhost:5000
```

## ✨ Features

- 📊 **Student Management** - Add, edit, delete students
- 💰 **Fee Tracking** - Track fees, payments, and pending amounts
- 📅 **Attendance System** - Mark and track student attendance
- 📈 **Analytics** - Monthly income charts and summaries
- 🎨 **Modern UI** - Glassmorphism design with dark/light mode
- 🔐 **Simple Login** - Basic authentication system
- 📱 **Responsive** - Works on all devices

## 📁 Project Structure

```
TutorTrack/
├── backend/
│   ├── config/           # Configuration files
│   │   └── database.js  # MongoDB connection
│   ├── controllers/     # Business logic
│   │   └── studentController.js
│   ├── models/          # Database models
│   │   └── Student.js
│   ├── routes/          # API routes
│   │   └── studentRoutes.js
│   ├── index.js         # Main server file
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── index.html       # Dashboard
│   ├── login.html       # Login page
│   ├── script.js        # Frontend logic
│   ├── style.css        # Styling
│   └── logo.png         # Your logo (add this!)
├── package.json         # Root scripts
└── DEPLOYMENT.md        # Full deployment guide
```

**See `PROJECT_STRUCTURE.md` for detailed structure documentation.**
