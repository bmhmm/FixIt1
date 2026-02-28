// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/authMiddleware');

// // Admin only routes
// router.get('/dashboard', protect, authorize('provider'), (req, res) => {
//     // Note: 'provider' type will be used for admin initially
//     res.json({ message: 'Admin dashboard' });
// });

// // For master admin, you can check specific email
// router.get('/master', protect, (req, res) => {
//     if (req.user.email === 'admin@fixit.com') {
//         res.json({ message: 'Master admin access' });
//     } else {
//         res.status(403).json({ error: 'Access denied' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getDashboard,
    getUsers,
    updateUserStatus,
    getPendingProviders,
    verifyProvider,
    getAllBookings,
    getReports
} = require('../controllers/adminControllers');

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/test', (req, res) => {
    res.json({ message: 'Admin routes are working!' });
});

// Add this route
// router.get('/users', protect, authorize('admin'), async (req, res) => {
//     try {
//         const { type } = req.query;
//         const pool = require('../config/database').pool;
        
//         let query = 'SELECT id, full_name, email, user_type, is_active, created_at FROM users';
//         let params = [];
        
//         if (type && type !== 'all') {
//             query += ' WHERE user_type = ?';
//             params.push(type);
//         }
        
//         const [users] = await pool.execute(query, params);
        
//         res.json({
//             success: true,
//             data: users
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, errors: ['Server error'] });
//     }
// });

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/providers/pending', getPendingProviders);
router.put('/providers/:id/verify', verifyProvider);
router.get('/bookings', getAllBookings);
router.get('/reports', getReports);

module.exports = router;