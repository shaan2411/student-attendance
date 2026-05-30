const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getClasses,
} = require('../controllers/studentController');

router.use(protect);

router.get('/classes', adminOnly, getClasses);
router.get('/', adminOnly, getAllStudents);
router.post('/', adminOnly, createStudent);
router.get('/:id', adminOnly, getStudent);
router.put('/:id', adminOnly, updateStudent);
router.delete('/:id', adminOnly, deleteStudent);

module.exports = router;
