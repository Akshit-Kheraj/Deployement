const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getCurrentUser,
    updateProfile,
    logout,
    refreshToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
    registerValidation,
    loginValidation,
    updateProfileValidation,
} = require('../utils/validators');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;
