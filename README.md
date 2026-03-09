# ArogyaMitra - AI-Powered Fitness & Wellness Platform

<div align="center">

![ArogyaMitra Logo](https://img.shields.io/badge/ArogyaMitra-AI_Fitness-4F46E5?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

*An intelligent health and wellness platform that delivers personalized health guidance through AI-powered workout planning, nutrition recommendations, and real-time wellness coaching.*

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage) • [Contributing](CONTRIBUTING.md) • [License](LICENSE)

</div>

---

## 🌟 Features

### ✅ Completed Features

#### Backend (FastAPI + SQLite)
- **User Authentication & Authorization** - JWT-based secure authentication
- **User Registration & Profile Management** - Complete user profile system with fitness goals
- **AI-Powered Workout Plans** - Generate personalized 7-day workout plans using Groq LLaMA-3.3-70B
- **AI-Powered Meal Plans** - Create customized nutrition plans with macro breakdowns
- **Interactive AI Coach (AROMI)** - Real-time chat with context-aware wellness coaching
- **Progress Tracking** - Weight tracking and progress visualization
- **Gamification & Achievements** - Unlock achievements and contribute to charity
- **Plan History** - Save and manage workout/meal plan history
- **SQLite Database** - Persistent data storage with SQLAlchemy ORM

#### Frontend (React + TypeScript + Tailwind)
- **Modern UI/UX** - Clean, responsive interface with Tailwind CSS
- **User Registration & Login** - Complete authentication flow
- **Dashboard** - Overview of workouts, meals, and progress
- **Workout Plan Generator** - Generate and manage workout plans with history
- **Meal Plan Generator** - Create customized meal plans with history
- **AI Coach Chat** - Interactive chat interface with AROMI
- **Progress Tracking** - Weight logging with achievements display
- **User Profile Page** - Comprehensive profile management
- **Protected Routes** - Secure navigation with JWT tokens

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- Groq API Key ([Get it here](https://console.groq.com/))

### One-Command Setup

> **📝 For Project Evaluators:** A working Groq API key is provided below for testing purposes.

1. **Install Dependencies** (First time only):
```powershell
# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. **Configure Environment:**
   
   Create `backend/.env` file with this content:
   ```env
   # Working API Key for project evaluation
   GROQ_API_KEY=your_api_key_here
   SECRET_KEY=arogyamitra-secret-key-change-in-production
   DATABASE_URL=sqlite:///./arogyamitra.db
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

   **Or simply run:**
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```
```

2. **Configure Environment** (First time only):
Create a `.env` file in the `backend` folder:
```env
GROQ_API_KEY=your-groq-api-key-here
SECRET_KEY=your-secret-key-for-jwt
DATABASE_URL=sqlite:///./arogyamitra.db
```

3. **Start Both Servers** (Backend + Frontend):

**PowerShell:**
```powershell
.\run aromi
```

**Command Prompt:**
```cmd
run aromi
```

That's it! 🎉

The command will open two windows:
- **Backend** at `http://localhost:8000`
- **Frontend** at `http://localhost:5173`

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

### Manual Setup (Alternative)

If you prefer to run servers separately:

**Backend:**
```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

## 📖 Usage

### First Time Setup

1. **Register an Account**
   - Go to `http://localhost:5173/register`
   - Create your account with username, email, and password
   - You'll be automatically logged in

2. **Complete Your Profile**
   - Click on "Profile" in the sidebar
   - Fill in your fitness information (age, weight, height, goals, etc.)
   - This helps the AI generate personalized plans

3. **Generate Your First Workout Plan**
   - Navigate to "Workout Plan"
   - Enter your fitness goals and preferences
   - Click "Generate New Plan"
   - Review your personalized 7-day workout plan

4. **Generate Your Meal Plan**
   - Navigate to "Meal Plan"
   - Describe your dietary preferences and restrictions
   - Get a customized 7-day nutrition plan with macros

5. **Chat with AROMI**
   - Go to "AI Coach"
   - Ask questions about fitness, nutrition, or health
   - Get personalized, context-aware advice

6. **Track Your Progress**
   - Use "Progress" to log your weight
   - View your progress statistics
   - Unlock achievements and contribute to charity

## 🏗️ Project Structure

```
AROGYAMITRA/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # SQLAlchemy models and DB config
│   ├── schemas.py              # Pydantic schemas for validation
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   └── user.py            # User model (legacy)
│   ├── routers/
│   │   ├── token.py           # Authentication endpoints
│   │   ├── users.py           # User management endpoints
│   │   ├── workout.py         # Workout plan endpoints
│   │   ├── meals.py           # Meal plan endpoints
│   │   ├── coach.py           # AI coach chat endpoints
│   │   └── progress.py        # Progress tracking endpoints
│   └── services/
│       ├── auth.py            # Authentication utilities
│       └── groq_service.py    # Groq API integration
│
└── frontend/
    ├── src/
    │   ├── App.tsx            # Main app component with routing
    │   ├── components/
    │   │   └── Layout.tsx     # Main layout with sidebar
    │   ├── pages/
    │   │   ├── LoginPage.tsx      # Login page
    │   │   ├── RegisterPage.tsx   # Registration page
    │   │   ├── Dashboard.tsx      # Main dashboard
    │   │   ├── WorkoutPlan.tsx    # Workout generator
    │   │   ├── MealPlan.tsx       # Meal planner
    │   │   ├── AICoach.tsx        # Chat interface
    │   │   ├── Progress.tsx       # Progress tracking
    │   │   └── ProfilePage.tsx    # User profile
    │   └── services/
    │       └── api.ts         # Axios API client
    ├── package.json
    └── tailwind.config.js
```

## 🔑 API Endpoints

### Authentication
- `POST /token` - Login and get JWT token
- `POST /register` - Register new user

### User Management
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `DELETE /users/me` - Delete user account

### Workout Plans
- `POST /workout/generate` - Generate new workout plan
- `GET /workout/history` - Get workout plan history
- `GET /workout/{id}` - Get specific workout plan
- `DELETE /workout/{id}` - Delete workout plan

### Meal Plans
- `POST /meals/generate` - Generate new meal plan
- `GET /meals/history` - Get meal plan history
- `GET /meals/{id}` - Get specific meal plan
- `DELETE /meals/{id}` - Delete meal plan

### AI Coach
- `POST /coach/chat` - Send message to AI coach
- `GET /coach/history` - Get chat history
- `DELETE /coach/history` - Clear chat history

### Progress Tracking
- `POST /progress/entry` - Add progress entry
- `GET /progress/entries` - Get all progress entries
- `GET /progress/stats` - Get progress statistics
- `GET /progress/achievements` - Get unlocked achievements

## 🎯 Key Technologies

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Groq API** - LLaMA-3.3-70B AI model
- **JWT** - Secure authentication
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 🐛 Troubleshooting

### Backend Won't Start
- Ensure Python 3.10+ is installed
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Verify your `.env` file has a valid GROQ_API_KEY

### Frontend Can't Connect to Backend
- Make sure the backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify the API URL in `frontend/src/services/api.ts`

### Database Issues
- Delete `arogyamitra.db` and restart the backend to recreate
- Check file permissions for the database file

For more detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Quick Contribution Steps:
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing the LLaMA-3.3-70B AI model
- **FastAPI** community for excellent documentation
- **React** and **Tailwind CSS** for modern frontend tools
- All contributors who help make ArogyaMitra better!

## 📞 Support

- 📖 [Documentation](README.md)
- 🐛 [Report Bug](../../issues)
- 💡 [Request Feature](../../issues)
- 💬 [Discussions](../../discussions)

---

<div align="center">

**Built with ❤️ for healthier living**

⭐ Star us on GitHub if you find this helpful!

</div>
