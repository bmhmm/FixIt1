const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only routes
router.get('/dashboard', protect, authorize('provider'), (req, res) => {
    // Note: 'provider' type will be used for admin initially
    res.json({ message: 'Admin dashboard' });
});

// For master admin, you can check specific email
router.get('/master', protect, (req, res) => {
    if (req.user.email === 'admin@fixit.com') {
        res.json({ message: 'Master admin access' });
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
});

module.exports = router;