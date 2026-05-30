const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: [true, 'Status is required'],
    },
    subject: {
      type: String,
      trim: true,
      default: 'General',
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

// Compound index: one record per student per date per subject
AttendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

// Static: get attendance percentage for a student
AttendanceSchema.statics.getPercentage = async function (studentId, subject) {
  const filter = { student: studentId };
  if (subject && subject !== 'all') filter.subject = subject;

  const total = await this.countDocuments(filter);
  const present = await this.countDocuments({
    ...filter,
    status: { $in: ['present', 'late'] },
  });

  if (total === 0) return { total: 0, present: 0, percentage: 0 };
  return {
    total,
    present,
    percentage: Math.round((present / total) * 100),
  };
};

module.exports = mongoose.model('Attendance', AttendanceSchema);
