const Course = require('../models/Course');

exports.addCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, notesLink } = req.body;
    const course = new Course({ title, description, videoUrl, notesLink });
    await course.save();
    res.status(201).json({ message: 'Course added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add course' });
  }
};
