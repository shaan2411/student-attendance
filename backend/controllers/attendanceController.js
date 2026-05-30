const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance (bulk for a date)
// @route   POST /api/attendance/mark
// @access  Admin
const markAttendance = async (req, res) => {
  try {
    const { date, subject, records } = req.body;
    // records: [{ studentId, status, remarks }]

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Records array is required.' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const ops = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, date: attendanceDate, subject: subject || 'General' },
        update: {
          $set: {
            status: r.status,
            remarks: r.remarks || '',
            markedBy: req.user._id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);

    res.json({ success: true, message: `Attendance marked for ${records.length} student(s).` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance records for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private (own + admin)
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, startDate, endDate, page = 1, limit = 30 } = req.query;

    // Students can only view their own records
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const filter = { student: studentId };
    if (subject && subject !== 'all') filter.subject = subject;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('markedBy', 'name');

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance percentage for a student
// @route   GET /api/attendance/percentage/:studentId
// @access  Private
const getAttendancePercentage = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject } = req.query;

    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const result = await Attendance.getPercentage(studentId, subject);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students' attendance summary (admin)
// @route   GET /api/attendance/summary
// @access  Admin
const getAttendanceSummary = async (req, res) => {
  try {
    const { subject, startDate, endDate } = req.query;

    const matchStage = {};
    if (subject && subject !== 'all') matchStage.subject = subject;
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const summary = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$student',
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0],
            },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
          late: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $project: {
          studentId: '$student.studentId',
          name: '$student.name',
          email: '$student.email',
          class: '$student.class',
          department: '$student.department',
          total: 1,
          present: 1,
          absent: 1,
          late: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 1],
          },
        },
      },
      { $sort: { name: 1 } },
    ]);

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance records for a specific date (for marking)
// @route   GET /api/attendance/date/:date
// @access  Admin
const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { subject } = req.query;

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const filter = { date: { $gte: attendanceDate, $lt: nextDay } };
    if (subject && subject !== 'all') filter.subject = subject;

    const records = await Attendance.find(filter).populate('student', 'name studentId class');
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subjects list
// @route   GET /api/attendance/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Attendance.distinct('subject');
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendancePercentage,
  getAttendanceSummary,
  getAttendanceByDate,
  getSubjects,
};
