const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');


router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.post('/add', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, notesLink } = req.body;
    const course = new Course({ title, description, videoUrl, notesLink });
    await course.save();
    res.status(201).json({ message: 'Course added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});


router.put('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, notesLink } = req.body;
    const updated = await Course.findByIdAndUpdate(req.params.id, {
      title,
      description,
      videoUrl,
      notesLink
    }, { new: true });

    if (!updated) return res.status(404).json({ error: 'Course not found' });

    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});


router.delete('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
