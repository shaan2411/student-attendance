# 🎓 EduTrack — Student Attendance Management System

<div align="center">

![EduTrack Banner](https://img.shields.io/badge/EduTrack-Attendance%20System-2563eb?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**A production-ready full-stack Student Attendance Management System with role-based authentication, real-time charts, and a modern white & blue UI.**

[Live Demo](#) · [Report Bug](https://github.com/shaan2411/student-attendance/issues) · [Request Feature](https://github.com/shaan2411/student-attendance/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Seed Demo Data](#seed-demo-data)
  - [Running the App](#running-the-app)
- [Demo Accounts](#-demo-accounts)
- [API Reference](#-api-reference)
  - [Auth Endpoints](#auth-endpoints)
  - [Student Endpoints](#student-endpoints)
  - [Attendance Endpoints](#attendance-endpoints)
- [Database Schema](#-database-schema)
- [UI Pages & Features](#-ui-pages--features)
- [Authentication & Security](#-authentication--security)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

EduTrack is a comprehensive **Student Attendance Management System** built for educational institutions. It provides a seamless experience for both **administrators** and **students** — admins can mark attendance in bulk, manage student records, and view detailed reports with charts, while students can track their own attendance percentage and history.

The system is built with a clean separation between the **React frontend** (port 5173) and **Node.js REST API backend** (port 5001), connected to a **MongoDB** database with **JWT-based authentication**.

---

## ✨ Features

### 👨‍💼 Admin Features
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Live stats (total students, today's present/absent, avg %), 7-day area chart, today's donut pie, top 5 performers table |
| ✅ **Mark Attendance** | Bulk attendance marking by date + subject. One-click "All Present / All Absent / All Late". Filter by class & search |
| 📋 **Attendance Report** | View any student's full attendance history. Filter by subject, date range. Summary stats + paginated table |
| 👥 **Manage Students** | Full CRUD — add, edit, delete students. Search by name/ID/email, filter by class, pagination |
| 🏫 **Class Management** | Filter students and reports by class/department |

### 🎓 Student Features
| Feature | Description |
|---------|-------------|
| 📈 **Personal Dashboard** | Radial attendance ring with %, subject-wise bar chart, recent attendance records |
| 📋 **My Attendance** | Full personal attendance history with subject & date range filters |
| 🔒 **Privacy** | Students can only view their own data — no access to other students' records |

### 🔒 Shared Features
- JWT authentication with 7-day expiry
- Role-based route protection (admin/student)
- Responsive design — works on mobile, tablet, desktop
- Real-time toast notifications
- Loading states and empty state handling

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.2.0 | Build tool & dev server |
| **React Router v6** | 6.23.1 | Client-side routing |
| **Axios** | 1.6.8 | HTTP client with interceptors |
| **Recharts** | 2.12.5 | Charts (Area, Bar, Pie, Radial) |
| **React Hot Toast** | 2.4.1 | Toast notifications |
| **date-fns** | 3.6.0 | Date formatting |
| **Vanilla CSS** | — | Custom white & blue design system |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.18.2 | REST API framework |
| **MongoDB** | — | Database |
| **Mongoose** | 8.3.0 | ODM for MongoDB |
| **JWT (jsonwebtoken)** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Morgan** | 1.10.0 | HTTP request logger |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.4.5 | Environment variables |
| **Nodemon** | 3.1.0 | Dev auto-restart |

---

## 📁 Project Structure

```
student-attendance/
│
├── 📄 README.md
├── 📄 .gitignore
│
├── 📂 backend/
│   ├── 📄 server.js              # Express app entry point
│   ├── 📄 seed.js                # Demo data seeder
│   ├── 📄 package.json
│   ├── 📄 .env.example           # Environment variable template
│   │
│   ├── 📂 config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── 📂 models/
│   │   ├── User.js               # Student/Admin schema + bcrypt
│   │   └── Attendance.js         # Attendance schema + aggregation
│   │
│   ├── 📂 controllers/
│   │   ├── authController.js     # register, login, getMe, updateProfile
│   │   ├── studentController.js  # CRUD + search + pagination
│   │   └── attendanceController.js # mark, records, percentage, summary
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js               # JWT Bearer token verification
│   │   └── adminOnly.js          # Admin role guard
│   │
│   └── 📂 routes/
│       ├── authRoutes.js
│       ├── studentRoutes.js
│       └── attendanceRoutes.js
│
└── 📂 frontend/
    ├── 📄 index.html
    ├── 📄 vite.config.js         # Proxy /api → localhost:5001
    ├── 📄 package.json
    │
    └── 📂 src/
        ├── 📄 main.jsx           # React 18 entry point
        ├── 📄 App.jsx            # Router + layout + toaster
        ├── 📄 index.css          # Global design system (white & blue)
        │
        ├── 📂 api/
        │   └── axios.js          # Axios instance + JWT interceptor
        │
        ├── 📂 context/
        │   └── AuthContext.jsx   # Global auth state (user, login, logout)
        │
        ├── 📂 components/
        │   ├── ProtectedRoute.jsx  # Auth + role guard wrapper
        │   ├── Sidebar.jsx         # Blue gradient nav sidebar
        │   ├── Sidebar.css
        │   ├── Navbar.jsx          # White topbar with date + user info
        │   └── Navbar.css
        │
        └── 📂 pages/
            ├── Login.jsx           # Login page with demo fill buttons
            ├── Login.css
            ├── AdminDashboard.jsx  # Stats + charts + top performers
            ├── StudentDashboard.jsx # Radial ring + subject chart
            ├── MarkAttendance.jsx  # Bulk attendance marking
            ├── ViewAttendance.jsx  # Filterable attendance records
            └── ManageStudents.jsx  # Student CRUD with modals
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- **MongoDB** (local) → [Download](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud, free tier)
- **npm** v9 or higher (comes with Node.js)
- **Git** → [Download](https://git-scm.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/shaan2411/student-attendance.git
cd student-attendance
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Environment Variables

The backend requires a `.env` file. A template is provided:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/attendance_db` |
| `JWT_SECRET` | Secret key for JWT signing | *(set a strong random string)* |
| `JWT_EXPIRE` | JWT token expiry duration | `7d` |
| `NODE_ENV` | Environment mode | `development` |

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### Seed Demo Data

Populate the database with a demo admin, 10 students, and 880 attendance records (30 days × 4 subjects):

```bash
cd backend
npm run seed
```

**Output:**
```
✅ MongoDB Connected: localhost
🌱 Starting seed...
✅ Cleared existing data
✅ Admin created: admin@school.com / admin123
✅ 10 students created
✅ 880 attendance records created
🎉 Seed complete!
```

> ⚠️ Running seed again will **clear all existing data** and re-seed fresh data.

### Running the App

Open **two terminal windows**:

**Terminal 1 — Start Backend**
```bash
cd backend
npm run dev
# 🚀 Server running on http://localhost:5001
# ✅ MongoDB Connected: localhost
```

**Terminal 2 — Start Frontend**
```bash
cd frontend
npm run dev
# ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Accounts

After running `npm run seed`, use these credentials to log in:

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Admin** | `admin@school.com` | `admin123` | Full access |
| **Student** | `alice@school.com` | `student123` | STU001, CS-A |
| **Student** | `bob@school.com` | `student123` | STU002, CS-A |
| **Student** | `carol@school.com` | `student123` | STU003, CS-B |
| **Student** | `david@school.com` | `student123` | STU004, CS-B |
| **Student** | `emma@school.com` | `student123` | STU005, EE-A |
| **Student** | `frank@school.com` | `student123` | STU006, EE-A |
| **Student** | `grace@school.com` | `student123` | STU007, EE-B |
| **Student** | `henry@school.com` | `student123` | STU008, ME-A |
| **Student** | `isla@school.com` | `student123` | STU009, ME-A |
| **Student** | `jack@school.com` | `student123` | STU010, CS-A |

> 💡 **Tip:** The Login page has **"Admin Demo"** and **"Student Demo"** quick-fill buttons — just click and sign in instantly!

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. The backend runs on `http://localhost:5001`.

The Vite dev proxy forwards all `/api` requests from the frontend to the backend automatically.

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login → returns JWT token |
| `GET` | `/api/auth/me` | 🔒 JWT | Get current logged-in user |
| `PUT` | `/api/auth/profile` | 🔒 JWT | Update name/phone |

**Login Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin"
  }
}
```

---

### Student Endpoints

> 🛡️ All student endpoints require JWT token + Admin role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | List all students (paginated, searchable) |
| `POST` | `/api/students` | Create a new student |
| `GET` | `/api/students/classes` | Get list of unique class names |
| `GET` | `/api/students/:id` | Get single student by ID |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Delete student + all their attendance records |

**Query Parameters for `GET /api/students`:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20) |
| `search` | string | Search by name, studentId, or email |
| `class` | string | Filter by class name |
| `department` | string | Filter by department |

**Create Student Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@school.com",
  "password": "student123",
  "studentId": "STU001",
  "class": "CS-A",
  "department": "Computer Science",
  "phone": "+1 234 567 8900"
}
```

---

### Attendance Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/attendance/mark` | 🛡️ Admin | Bulk mark attendance for a date |
| `GET` | `/api/attendance/summary` | 🛡️ Admin | All students' attendance summary |
| `GET` | `/api/attendance/subjects` | 🔒 JWT | Get list of all subjects |
| `GET` | `/api/attendance/date/:date` | 🛡️ Admin | Get attendance records for a specific date |
| `GET` | `/api/attendance/student/:studentId` | 🔒 JWT | Get a student's attendance records |
| `GET` | `/api/attendance/percentage/:studentId` | 🔒 JWT | Get a student's attendance percentage |

**Mark Attendance Request Body:**
```json
{
  "date": "2024-01-15",
  "subject": "Mathematics",
  "records": [
    { "studentId": "64f...", "status": "present" },
    { "studentId": "64g...", "status": "absent", "remarks": "Sick leave" },
    { "studentId": "64h...", "status": "late" }
  ]
}
```

**Attendance Percentage Response:**
```json
{
  "success": true,
  "total": 88,
  "present": 72,
  "percentage": 82
}
```

**Attendance Summary Response (per student):**
```json
{
  "success": true,
  "summary": [
    {
      "name": "Alice Johnson",
      "studentId": "STU001",
      "class": "CS-A",
      "total": 88,
      "present": 74,
      "absent": 10,
      "late": 4,
      "percentage": 84.1
    }
  ]
}
```

---

## 🗄 Database Schema

### User Model (`users` collection)

```js
{
  name:           String,      // required, max 100 chars
  email:          String,      // required, unique, lowercase
  password:       String,      // hashed with bcryptjs (12 rounds), select: false
  role:           String,      // enum: ['admin', 'student'], default: 'student'
  studentId:      String,      // unique, sparse (optional for admin)
  class:          String,      // e.g. "CS-A"
  department:     String,      // e.g. "Computer Science"
  enrollmentDate: Date,        // default: Date.now
  phone:          String,
  avatar:         String,
  isActive:       Boolean,     // default: true
  createdAt:      Date,        // auto (timestamps)
  updatedAt:      Date         // auto (timestamps)
}
```

### Attendance Model (`attendances` collection)

```js
{
  student:   ObjectId,    // ref: 'User', required
  date:      Date,        // required (stored as UTC midnight)
  status:    String,      // enum: ['present', 'absent', 'late']
  subject:   String,      // default: 'General'
  markedBy:  ObjectId,    // ref: 'User' (the admin who marked it)
  remarks:   String,      // optional, max 200 chars
  createdAt: Date,
  updatedAt: Date
}

// Compound unique index → one record per student per date per subject
Index: { student: 1, date: 1, subject: 1 } (unique)
```

---

## 🖥 UI Pages & Features

### Login Page (`/login`)
- Animated soft blue orbs background
- White card with blue top-accent stripe
- **"Admin Demo"** and **"Student Demo"** one-click fill buttons
- Form validation with error toasts
- JWT token stored in `localStorage` on success
- Auto-redirects to appropriate dashboard based on role

### Admin Dashboard (`/admin`)
- **4 stat cards** — Total Students, Today Present, Today Absent, Avg Attendance %
- **7-day area chart** — Present vs Absent trend (Recharts AreaChart)
- **Today's donut chart** — Present vs Absent (Recharts PieChart)
- **Top 5 performers** table with progress bars and medal emojis

### Mark Attendance (`/admin/mark`)
- Select **date** and **subject** from dropdown
- **Filter** students by class, search by name/ID
- **Bulk actions** — "All Present", "All Absent", "All Late" buttons
- **Live counter** showing P/A/L totals as you mark
- Per-student **toggle buttons** (Present / Absent / Late) with color coding
- Loads existing attendance if already marked for that date/subject (upsert)
- Save button submits bulk update to backend

### Attendance Report (`/admin/attendance` and `/student/attendance`)
- Admin can select any student from dropdown
- Students automatically see only their own data
- Filters: **subject**, **start date**, **end date**
- **Summary stat cards** — Total Days, Present, Absent, Percentage
- **Paginated table** (20 records/page) with date, subject, status badge, marked-by, remarks
- Color-coded status badges (green/red/yellow)

### Manage Students (`/admin/students`)
- Paginated table (15/page) with avatar, name, email, studentId, class, department, phone, status
- **Search bar** (name, ID, email) + **class filter** dropdown
- **Add Student** modal with full form (name, email, password, ID, class, dept, phone)
- **Edit Student** modal pre-filled with existing data
- **Delete confirmation** modal with warning message
- Shows total student count

### Student Dashboard (`/student`)
- **Radial ring** showing overall attendance % with color coding:
  - 🟢 Green (≥75%) — Excellent
  - 🟡 Amber (50–74%) — Needs Improvement
  - 🔴 Red (<50%) — Critical
- **Subject bar chart** — attendance % per subject
- **Recent records** table — last 10 attendance entries

---

## 🔐 Authentication & Security

### JWT Flow
```
1. User POSTs credentials to /api/auth/login
2. Server validates password with bcrypt.compare()
3. Server signs JWT: jwt.sign({ id }, SECRET, { expiresIn: '7d' })
4. Frontend stores token in localStorage
5. Axios interceptor attaches: Authorization: Bearer <token>
6. On 401 response → auto logout + redirect to /login
```

### Security Measures
| Measure | Implementation |
|---------|---------------|
| **Password Hashing** | bcryptjs with 12 salt rounds |
| **JWT Expiry** | 7 days (configurable via `JWT_EXPIRE`) |
| **Role Guards** | `adminOnly` middleware on all admin routes |
| **Data Isolation** | Students can only query their own `_id` |
| **CORS** | Configured per `NODE_ENV` |
| **No `.env` in Git** | `.gitignore` excludes `backend/.env` |
| **Input Validation** | Mongoose schema validators + required fields |

### Protected Routes (Frontend)
```jsx
// Auth required
<ProtectedRoute> → redirects to /login if no token

// Auth + Admin role required
<ProtectedRoute adminOnly> → redirects to /student if not admin
```

---

## 📸 Screenshots

### Login Page
> Clean white card with blue accent, animated background orbs, one-click demo fill buttons.

### Admin Dashboard
> 4 KPI cards, 7-day trend chart, today's donut chart, top performers leaderboard.

### Mark Attendance
> Filterable student list with colour-coded Present/Absent/Late toggle buttons.

### Student Dashboard
> Personal radial attendance ring, subject-wise bar chart, recent records table.

### Manage Students
> Paginated CRUD table with search, class filter, and add/edit/delete modals.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contributions
- [ ] Export attendance to PDF/Excel
- [ ] Email notifications for low attendance
- [ ] Parent portal view
- [ ] Dark mode toggle
- [ ] Biometric/QR code attendance
- [ ] Multi-school support

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shaan Shafeeque**
- GitHub: [@shaan2411](https://github.com/shaan2411)
- Project: [student-attendance](https://github.com/shaan2411/student-attendance)

---

<div align="center">

Made with ❤️ using React, Node.js, Express & MongoDB

⭐ **Star this repo if you found it helpful!**

</div>
