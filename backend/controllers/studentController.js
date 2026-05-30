const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Get all students
// @route   GET /api/students
// @access  Admin
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, class: cls, department } = req.query;

    const filter = { role: 'student' };
    if (cls) filter.class = cls;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Admin
const getStudent = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student',
    }).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create student (admin adds student)
// @route   POST /api/students
// @access  Admin
const createStudent = async (req, res) => {
  try {
    const { name, email, password, studentId, class: cls, department, phone } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email or student ID already exists.',
      });
    }

    const student = await User.create({
      name,
      email,
      password,
      studentId,
      class: cls,
      department,
      phone,
      role: 'student',
    });

    const { password: _, ...studentData } = student.toObject();
    res.status(201).json({ success: true, student: studentData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Admin
const updateStudent = async (req, res) => {
  try {
    const { name, class: cls, department, phone, isActive, studentId } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { name, class: cls, department, phone, isActive, studentId },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'student',
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Also remove their attendance records
    await Attendance.deleteMany({ student: req.params.id });

    res.json({ success: true, message: 'Student and attendance records deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unique classes
// @route   GET /api/students/classes
// @access  Admin
const getClasses = async (req, res) => {
  try {
    const classes = await User.distinct('class', { role: 'student', class: { $ne: null } });
    res.json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent, getClasses };
