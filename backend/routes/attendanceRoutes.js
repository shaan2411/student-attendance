const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  markAttendance,
  getStudentAttendance,
  getAttendancePercentage,
  getAttendanceSummary,
  getAttendanceByDate,
  getSubjects,
} = require('../controllers/attendanceController');

router.use(protect);

router.post('/mark', adminOnly, markAttendance);
router.get('/summary', adminOnly, getAttendanceSummary);
router.get('/subjects', getSubjects);
router.get('/date/:date', adminOnly, getAttendanceByDate);
router.get('/student/:studentId', getStudentAttendance);
router.get('/percentage/:studentId', getAttendancePercentage);

module.exports = router;
