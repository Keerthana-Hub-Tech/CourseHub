const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['enrolled', 'completed'], default: 'enrolled' },
  certificateIssued: { type: Boolean, default: false }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);