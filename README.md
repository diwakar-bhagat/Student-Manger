# 🎓 Smart Student Task Manager

A modern, responsive full-stack web application designed to help students manage their academic workload with an intelligent priority system and a premium dark-themed UI.

## 🚀 Features

- **Intelligent Priority Assignment**: Automatically calculates task priority based on the deadline (High, Medium, Low).
- **Modern Dashboard**: Visual progress summary with total, completed, and pending task counts.
- **Secure Authentication**: JWT-based login and signup system.
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) with status toggling.
- **Search & Filter**: Easily find tasks by name or filter by status/priority.
- **Premium UI**: Responsive dark theme with Glassmorphism effects and smooth transitions.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Lucide React (Icons), Axios, Date-fns.
- **Backend**: Node.js, Express.js, JWT.
- **Database**: MongoDB (Mongoose).

## 📦 Project Structure

```text
smart-student-task-manager/
├── backend/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Auth & validation
│   ├── .env           # Environment configurations
│   └── server.js      # Entry point
└── frontend/
    ├── src/
    │   ├── components/# React UI components
    │   ├── api.js     # API utility
    │   ├── App.jsx    # Main routing
    │   └── index.css  # Global styles
    └── index.html
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas connection string)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your `MONGO_URI` and `JWT_SECRET`.
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🧠 Smart Priority Logic

The system automatically assigns priority based on the time remaining:
- **High**: ≤ 2 days to deadline.
- **Medium**: ≤ 5 days to deadline.
- **Low**: > 5 days to deadline.

---

Built with ❤️ for students who want to stay organized.
