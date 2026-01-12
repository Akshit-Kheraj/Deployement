const express = require('express');
const router = express.Router();
const {
    getPendingUsers,
    getAllUsers,
    approveUser,
    rejectUser,
    getStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

// All routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// Admin routes
router.get('/pending-users', getPendingUsers);
router.get('/users', getAllUsers);
router.put('/approve-user/:id', approveUser);
router.put('/reject-user/:id', rejectUser);
router.delete('/reject-user/:id', rejectUser); // Also support DELETE method
router.get('/stats', getStats);

module.exports = router;
