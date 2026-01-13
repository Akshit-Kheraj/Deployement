const User = require('../models/User');

/**
 * @desc    Get all pending users awaiting approval
 * @route   GET /api/admin/pending-users
 * @access  Private/Admin
 */
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ isApproved: false, isActive: true })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pendingUsers.length,
            data: pendingUsers,
        });
    } catch (error) {
        console.error('Get pending users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending users',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all users with optional filtering
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const { status, userType, search } = req.query;

        // Build query
        const query = {};

        if (status === 'approved') {
            query.isApproved = true;
        } else if (status === 'pending') {
            query.isApproved = false;
        }

        if (userType && userType !== 'all') {
            query.userType = userType;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message,
        });
    }
};

/**
 * @desc    Approve a user
 * @route   PUT /api/admin/approve-user/:id
 * @access  Private/Admin
 */
const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'User is already approved',
            });
        }

        user.isApproved = true;
        user.approvedBy = req.user.id;
        user.approvedAt = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User approved successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                isApproved: user.isApproved,
                approvedAt: user.approvedAt,
            },
        });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving user',
            error: error.message,
        });
    }
};

/**
 * @desc    Reject/Delete a user
 * @route   PUT /api/admin/reject-user/:id
 * @access  Private/Admin
 */
const rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'Cannot reject an already approved user',
            });
        }

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User rejected and removed from the system',
        });
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting user',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete any user (including approved users)
 * @route   DELETE /api/admin/delete-user/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        // Prevent deleting other admins
        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete admin users',
            });
        }

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully. They will need to sign up again to regain access.',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingUsers = await User.countDocuments({ isApproved: false });
        const approvedUsers = await User.countDocuments({ isApproved: true });
        const totalPatients = await User.countDocuments({ userType: 'patient' });
        const totalDoctors = await User.countDocuments({ userType: 'doctor' });
        const inactiveUsers = await User.countDocuments({ isActive: false });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                pendingUsers,
                approvedUsers,
                totalPatients,
                totalDoctors,
                inactiveUsers,
            },
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message,
        });
    }
};

module.exports = {
    getPendingUsers,
    getAllUsers,
    approveUser,
    rejectUser,
    deleteUser,
    getStats,
};
