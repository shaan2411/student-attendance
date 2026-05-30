require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Attendance = require('./models/Attendance');

const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear existing data
  await User.deleteMany({});
  await Attendance.deleteMany({});
  console.log('✅ Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@school.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('✅ Admin created: admin@school.com / admin123');

  // Create students
  const studentsData = [
    { name: 'Alice Johnson',   email: 'alice@school.com',   password: 'student123', studentId: 'STU001', class: 'CS-A', department: 'Computer Science' },
    { name: 'Bob Smith',       email: 'bob@school.com',     password: 'student123', studentId: 'STU002', class: 'CS-A', department: 'Computer Science' },
    { name: 'Carol Williams',  email: 'carol@school.com',   password: 'student123', studentId: 'STU003', class: 'CS-B', department: 'Computer Science' },
    { name: 'David Brown',     email: 'david@school.com',   password: 'student123', studentId: 'STU004', class: 'CS-B', department: 'Computer Science' },
    { name: 'Emma Davis',      email: 'emma@school.com',    password: 'student123', studentId: 'STU005', class: 'EE-A', department: 'Electrical Eng.' },
    { name: 'Frank Miller',    email: 'frank@school.com',   password: 'student123', studentId: 'STU006', class: 'EE-A', department: 'Electrical Eng.' },
    { name: 'Grace Wilson',    email: 'grace@school.com',   password: 'student123', studentId: 'STU007', class: 'EE-B', department: 'Electrical Eng.' },
    { name: 'Henry Moore',     email: 'henry@school.com',   password: 'student123', studentId: 'STU008', class: 'ME-A', department: 'Mechanical Eng.' },
    { name: 'Isla Taylor',     email: 'isla@school.com',    password: 'student123', studentId: 'STU009', class: 'ME-A', department: 'Mechanical Eng.' },
    { name: 'Jack Anderson',   email: 'jack@school.com',    password: 'student123', studentId: 'STU010', class: 'CS-A', department: 'Computer Science' },
  ];

  const students = await User.create(studentsData);
  console.log(`✅ ${students.length} students created`);

  // Generate attendance for past 30 days
  const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English'];
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'late'];
  const records = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setUTCHours(0, 0, 0, 0);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (const subject of subjects) {
      for (const student of students) {
        records.push({
          student: student._id,
          date,
          subject,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          markedBy: admin._id,
        });
      }
    }
  }

  await Attendance.insertMany(records, { ordered: false });
  console.log(`✅ ${records.length} attendance records created`);

  console.log('\n🎉 Seed complete!');
  console.log('─────────────────────────────');
  console.log('Admin:    admin@school.com  / admin123');
  console.log('Students: alice@school.com  / student123');
  console.log('          bob@school.com    / student123');
  console.log('          (and more...)');
  console.log('─────────────────────────────');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
