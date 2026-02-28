const { pool } = require('../config/database');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// const getDashboard = async (req, res) => {
//     try {
//         // Get total users
//         const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
        
//         // Get total providers
//         const [totalProviders] = await pool.execute(
//             'SELECT COUNT(*) as count FROM users WHERE user_type = "provider"'
//         );
        
//         // Get total bookings
//         const [totalBookings] = await pool.execute('SELECT COUNT(*) as count FROM bookings');
        
//         // Get pending verifications (providers not verified)
//         const [pendingVerifications] = await pool.execute(
//             'SELECT COUNT(*) as count FROM users WHERE user_type = "provider" AND is_verified = 0'
//         );
        
//         // Get total revenue from completed payments
//         const [revenue] = await pool.execute(
//             'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "completed"'
//         );

//         res.json({
//             success: true,
//             data: {
//                 totalUsers: totalUsers[0].count,
//                 totalProviders: totalProviders[0].count,
//                 totalBookings: totalBookings[0].count,
//                 pendingVerifications: pendingVerifications[0].count,
//                 revenue: revenue[0].total
//             }
//         });
//     } catch (error) {
//         console.error('Admin dashboard error:', error);
//         res.status(500).json({ success: false, errors: ['Server error'] });
//     }
// };


const getDashboard = async (req, res) => {
    try {
        // Get total users
        const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
        
        // Get total providers
        const [totalProviders] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE user_type = "provider"'
        );
        
        // Get total bookings
        const [totalBookings] = await pool.execute('SELECT COUNT(*) as count FROM bookings');
        
        // Get pending verifications
        const [pendingVerifications] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE user_type = "provider" AND is_verified = 0'
        );
        
        // Get total revenue
        const [revenue] = await pool.execute(
            'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "completed"'
        );

        res.json({
            success: true,
            data: {
                totalUsers: totalUsers[0].count,
                totalProviders: totalProviders[0].count,
                totalBookings: totalBookings[0].count,
                pendingVerifications: pendingVerifications[0].count,
                revenue: revenue[0].total
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};


// @desc    Get all users with filters
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const { type = 'all' } = req.query;
        
        let query = 'SELECT id, full_name, email, user_type, is_active, is_verified, created_at FROM users';
        let params = [];
        
        if (type !== 'all') {
            query += ' WHERE user_type = ?';
            params.push(type);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [users] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

// @desc    Update user status (active/suspended)
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await pool.execute(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [status, id]
        );
        
        res.json({
            success: true,
            message: 'User status updated'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

// @desc    Get pending provider verifications
// @route   GET /api/admin/providers/pending
const getPendingProviders = async (req, res) => {
    try {
        const [providers] = await pool.execute(
            `SELECT u.id, u.full_name, u.email, u.phone, u.location, u.created_at,
                    pd.hourly_rate, pd.services, pd.bio
             FROM users u
             LEFT JOIN provider_details pd ON u.id = pd.provider_id
             WHERE u.user_type = 'provider' AND u.is_verified = 0
             ORDER BY u.created_at DESC`
        );
        
        res.json({
            success: true,
            data: providers
        });
    } catch (error) {
        console.error('Pending providers error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

// @desc    Verify or reject provider
// @route   PUT /api/admin/providers/:id/verify
const verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { verified } = req.body;
        
        await pool.execute(
            'UPDATE users SET is_verified = ? WHERE id = ?',
            [verified ? 1 : 0, id]
        );
        
        res.json({
            success: true,
            message: verified ? 'Provider verified' : 'Provider rejected'
        });
    } catch (error) {
        console.error('Verify provider error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
    try {
        const { status = 'all', range = 'all' } = req.query;
        
        let query = `
            SELECT b.*, 
                   c.full_name as customer_name,
                   p.full_name as provider_name
            FROM bookings b
            JOIN users c ON b.customer_id = c.id
            JOIN users p ON b.provider_id = p.id
            WHERE 1=1
        `;
        let params = [];
        
        if (status !== 'all') {
            query += ' AND b.status = ?';
            params.push(status);
        }
        
        if (range === 'today') {
            query += ' AND DATE(b.created_at) = CURDATE()';
        } else if (range === 'week') {
            query += ' AND YEARWEEK(b.created_at) = YEARWEEK(CURDATE())';
        } else if (range === 'month') {
            query += ' AND MONTH(b.created_at) = MONTH(CURDATE())';
        }
        
        query += ' ORDER BY b.created_at DESC';
        
        const [bookings] = await pool.execute(query, params);
        
        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

// @desc    Get reports data
// @route   GET /api/admin/reports
const getReports = async (req, res) => {
    try {
        const { type = 'revenue', period = 'month' } = req.query;
        
        // Get total revenue
        const [revenue] = await pool.execute(
            'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "completed"'
        );
        
        // Get total bookings
        const [bookings] = await pool.execute('SELECT COUNT(*) as count FROM bookings');
        
        // Get new users this month
        const [newUsers] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE MONTH(created_at) = MONTH(CURDATE())'
        );
        
        // Get average booking value
        const [avgValue] = await pool.execute(
            'SELECT COALESCE(AVG(price), 0) as avg FROM bookings WHERE status = "completed"'
        );
        
        // Get top providers
        const [topProviders] = await pool.execute(`
            SELECT u.full_name as name, 
                   COUNT(b.id) as jobs,
                   COALESCE(SUM(b.price), 0) as revenue,
                   COALESCE(AVG(r.rating), 0) as rating
            FROM users u
            LEFT JOIN bookings b ON u.id = b.provider_id AND b.status = 'completed'
            LEFT JOIN reviews r ON u.id = r.provider_id
            WHERE u.user_type = 'provider'
            GROUP BY u.id
            ORDER BY revenue DESC
            LIMIT 5
        `);
        
        res.json({
            success: true,
            data: {
                totalRevenue: revenue[0].total,
                totalBookings: bookings[0].count,
                newUsers: newUsers[0].count,
                avgBookingValue: avgValue[0].avg,
                topProviders
            }
        });
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    updateUserStatus,
    getPendingProviders,
    verifyProvider,
    getAllBookings,
    getReports
};