const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/authController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware'); 

router.post('/register', register);
router.post('/login', login);


router.get('/users', authenticateUser, requireAdmin, getAllUsers);

module.exports = router;
