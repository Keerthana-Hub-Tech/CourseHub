const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Course = require('../models/Course');

// ✅ Enroll in course
router.post('/', authenticateUser, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) return res.status(400).json({ error: 'Already enrolled in this course' });

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    res.json({ message: 'Enrolled successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// ✅ Mark complete + auto-issue certificate
router.put('/complete', authenticateUser, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    enrollment.status = 'completed';
    enrollment.certificateIssued = true; // 🔁 Automatically issue certificate
    await enrollment.save();

    res.json({ message: 'Course marked as completed and certificate issued!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark complete' });
  }
});

// ✅ Download Certificate (only if course completed)
router.get('/certificate/:courseId', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment || enrollment.status !== 'completed') {
      return res.status(403).json({ error: 'Course not completed yet.' });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
    doc.pipe(res);

    doc.fontSize(24).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`This certifies that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(22).text(`${user.email}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(18).text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`${course.title}`, { align: 'center', underline: true });
    doc.moveDown(2);
    doc.fontSize(14).text(`Issued by CourseHub`, { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// ✅ Admin: View all enrollments
router.get('/all', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const allEnrollments = await Enrollment.find().populate('userId').populate('courseId');
    res.json(allEnrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load enrollments' });
  }
});

// ✅ Get all enrollments for the current user
router.get('/user', authenticateUser, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
    res.json(enrollments);
  } catch (err) {
    console.error('❌ Error fetching user enrollments:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});
// 📂 In routes/enroll.js

// ✅ Get all enrolled courses for the logged-in user
router.get('/my', authenticateUser, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('courseId');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load your enrollments' });
  }
});


module.exports = router;
