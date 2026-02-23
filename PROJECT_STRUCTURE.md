# 📁 TutorTrack - Project Structure

## 🗂️ Directory Structure

```
TutorTrack/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   └── studentController.js # Business logic for student operations
│   ├── models/
│   │   └── Student.js           # Student schema/model definition
│   ├── routes/
│   │   └── studentRoutes.js     # API route definitions
│   ├── index.js                 # Main server entry point
│   ├── package.json             # Backend dependencies
│   └── node_modules/           # Backend packages (auto-generated)
│
├── frontend/
│   ├── index.html               # Main dashboard page
│   ├── login.html               # Login page
│   ├── script.js                # Frontend JavaScript logic
│   ├── style.css                # Styling and themes
│   └── logo.png                 # Application logo (add your own)
│
├── docs/                        # Documentation files
│   ├── START_HERE.md            # Quick start guide
│   ├── DEPLOYMENT.md            # Deployment instructions
│   ├── LOGO_SETUP.md            # Logo setup guide
│   └── TESTING_PROMPT.md        # API testing guide
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package.json with scripts
├── README.md                    # Project overview
└── PROJECT_STRUCTURE.md         # This file
```

---

## 📋 File Descriptions

### Backend Structure

#### `backend/index.js`
- **Purpose**: Main server entry point
- **Responsibilities**:
  - Initialize Express app
  - Configure middleware (CORS, JSON parser)
  - Serve static frontend files
  - Connect to database
  - Register routes
  - Start server

#### `backend/config/database.js`
- **Purpose**: Database connection configuration
- **Responsibilities**:
  - MongoDB connection setup
  - Connection event handlers
  - Graceful shutdown handling
  - Error handling

#### `backend/models/Student.js`
- **Purpose**: Student data model/schema
- **Responsibilities**:
  - Define Student schema structure
  - Set validation rules
  - Define default values
  - Export Student model

#### `backend/controllers/studentController.js`
- **Purpose**: Business logic for student operations
- **Responsibilities**:
  - Handle all CRUD operations
  - Process requests
  - Interact with database
  - Return responses
  - Error handling

#### `backend/routes/studentRoutes.js`
- **Purpose**: API route definitions
- **Responsibilities**:
  - Define all student endpoints
  - Map routes to controllers
  - Handle route parameters

### Frontend Structure

#### `frontend/index.html`
- **Purpose**: Main dashboard page
- **Features**: Student management interface

#### `frontend/login.html`
- **Purpose**: Login page
- **Features**: Simple authentication

#### `frontend/script.js`
- **Purpose**: Frontend JavaScript logic
- **Features**: API calls, UI interactions, data manipulation

#### `frontend/style.css`
- **Purpose**: Styling and themes
- **Features**: Glassmorphism design, dark/light mode

---

## 🏗️ Architecture Pattern

### MVC (Model-View-Controller) Pattern

```
┌─────────────┐
│   Routes    │  ← Define API endpoints
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers  │  ← Handle business logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │  ← Interact with database
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │  ← Data storage
└─────────────┘
```

### Request Flow

1. **Client** sends HTTP request → `Routes`
2. **Routes** forwards to → `Controllers`
3. **Controllers** use → `Models` to interact with database
4. **Models** query → `MongoDB`
5. Response flows back: MongoDB → Models → Controllers → Routes → Client

---

## 🔄 Data Flow Example

### Adding a Student

```
1. Frontend (script.js)
   ↓ POST /students
   
2. Backend Routes (studentRoutes.js)
   ↓ router.post("/", ...)
   
3. Controller (studentController.js)
   ↓ createStudent()
   
4. Model (Student.js)
   ↓ new Student(req.body)
   
5. MongoDB
   ↓ Save document
   
6. Response flows back
   MongoDB → Model → Controller → Route → Frontend
```

---

## 📦 Dependencies

### Backend Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing

### Frontend Dependencies
- **Chart.js**: (CDN) For analytics charts
- Pure JavaScript (no build tools needed)

---

## 🚀 Benefits of This Structure

✅ **Separation of Concerns**: Each file has a single responsibility  
✅ **Scalability**: Easy to add new features  
✅ **Maintainability**: Code is organized and easy to find  
✅ **Testability**: Controllers and models can be tested independently  
✅ **Reusability**: Models and controllers can be reused  
✅ **Professional**: Follows industry best practices  

---

## 📝 Adding New Features

### To add a new model (e.g., Teacher):

1. **Create Model**: `backend/models/Teacher.js`
2. **Create Controller**: `backend/controllers/teacherController.js`
3. **Create Routes**: `backend/routes/teacherRoutes.js`
4. **Register Routes**: Add to `backend/index.js`

### Example:
```javascript
// backend/index.js
const teacherRoutes = require("./routes/teacherRoutes");
app.use("/teachers", teacherRoutes);
```

---

## 🔍 Code Organization Principles

1. **Models**: Only database schemas and validation
2. **Controllers**: Business logic and request handling
3. **Routes**: Only route definitions and middleware
4. **Config**: Configuration files (database, app settings)
5. **Frontend**: All UI-related files in one folder

---

## 📚 Next Steps

- See `START_HERE.md` for quick setup
- See `DEPLOYMENT.md` for deployment guide
- See `TESTING_PROMPT.md` for API testing

---

**This structure makes your codebase professional, maintainable, and ready to scale! 🚀**
