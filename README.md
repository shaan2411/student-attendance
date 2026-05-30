# 🎓 EduTrack — Student Attendance Management System

A full-stack, production-ready Student Attendance Management System built with **React**, **Node.js**, **Express.js**, and **MongoDB**. Features JWT authentication, role-based access control, real-time charts, and a modern glassmorphism UI.

---

## ✨ Features

| Feature | Admin | Student |
|---------|-------|---------|
| JWT Authentication | ✅ | ✅ |
| Dashboard with Charts | ✅ | ✅ |
| Mark Attendance (Bulk) | ✅ | ❌ |
| View Attendance Records | ✅ (all) | ✅ (own) |
| Attendance % Calculation | ✅ | ✅ |
| Add / Edit / Delete Students | ✅ | ❌ |
| Search & Filter Students | ✅ | ❌ |
| Subject-wise Reports | ✅ | ✅ |
| Date Range Filtering | ✅ | ✅ |
| Responsive Mobile UI | ✅ | ✅ |

---

## 🗂 Folder Structure

```
student/
├── backend/               # Node.js + Express API
│   ├── config/db.js       # MongoDB connection
│   ├── controllers/       # Route handlers
│   ├── middleware/        # JWT auth + admin guard
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── seed.js            # Demo data seeder
│   ├── server.js          # App entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/              # React + Vite app
    ├── src/
    │   ├── api/axios.js        # Axios + interceptors
    │   ├── context/            # Auth context
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Page-level components
    │   ├── App.jsx             # Routing
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Global design system
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** v9+

---

### 1. Install Backend

```bash
cd student/backend
npm install
```

Configure environment (already set up with defaults):
```bash
# .env is already created with these defaults:
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=attendance_system_jwt_secret_2024
JWT_EXPIRE=7d
```

Seed demo data (10 students + 30 days history):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev    # development (with auto-reload)
# or
npm start      # production
```

Backend runs on: **http://localhost:5000**

---

### 2. Install Frontend

```bash
cd student/frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

### 3. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Student | alice@school.com | student123 |
| Student | bob@school.com | student123 |
| Student | carol@school.com | student123 |
| + 7 more students | see seed.js | student123 |

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET  | `/api/auth/me` | JWT | Current user |
| PUT  | `/api/auth/profile` | JWT | Update profile |

### Students (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all (paginated, searchable) |
| POST | `/api/students` | Create student |
| GET | `/api/students/:id` | Get single student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student + records |
| GET | `/api/students/classes` | List unique classes |

### Attendance
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/attendance/mark` | Admin | Bulk mark attendance |
| GET | `/api/attendance/student/:id` | JWT | Student's records |
| GET | `/api/attendance/percentage/:id` | JWT | Attendance % |
| GET | `/api/attendance/summary` | Admin | All students summary |
| GET | `/api/attendance/date/:date` | Admin | Records by date |
| GET | `/api/attendance/subjects` | JWT | All subjects |

---

## 🛡️ Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- **JWT** tokens expire in 7 days
- Admin-only routes protected by role middleware
- Students can only access their own data
- CORS configured per environment

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Charts | Recharts |
| Styling | Vanilla CSS (glassmorphism dark theme) |
| State | React Context + useState |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Dev Tools | Nodemon, Morgan |

---

## 📝 License

MIT — Feel free to use and extend for your projects.
