const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/authController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware'); // ✅ Add this

router.post('/register', register);
router.post('/login', login);

// ✅ Admin-only route to fetch all users
router.get('/users', authenticateUser, requireAdmin, getAllUsers);

module.exports = router;
