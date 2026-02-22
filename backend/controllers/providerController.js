const { pool } = require('../config/database');

// @desc    Get provider dashboard stats
// @route   GET /api/provider/dashboard
const getDashboard = async (req, res) => {
    try {
        const providerId = req.user.id;

        // Get today's jobs count
        const [todayJobs] = await pool.execute(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE provider_id = ? AND DATE(date) = CURDATE()`,
            [providerId]
        );

        // Get pending requests count
        const [pendingRequests] = await pool.execute(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE provider_id = ? AND status = 'pending'`,
            [providerId]
        );

        // Get this month's earnings
        const [monthEarnings] = await pool.execute(
            `SELECT COALESCE(SUM(amount), 0) as total FROM payments 
             WHERE provider_id = ? AND MONTH(created_at) = MONTH(CURDATE())`,
            [providerId]
        );

        // Get average rating
        const [rating] = await pool.execute(
            `SELECT COALESCE(AVG(rating), 0) as avg_rating FROM reviews 
             WHERE provider_id = ?`,
            [providerId]
        );

        res.json({
            success: true,
            data: {
                todayJobs: todayJobs[0].count,
                pendingRequests: pendingRequests[0].count,
                monthEarnings: monthEarnings[0].total,
                rating: Number(rating[0].avg_rating).toFixed(1)
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get all booking requests
// @route   GET /api/provider/requests
const getBookingRequests = async (req, res) => {
    try {
        const providerId = req.user.id;

        const [requests] = await pool.execute(
            `SELECT b.*, u.full_name as customer_name, u.phone, u.location 
             FROM bookings b
             JOIN users u ON b.customer_id = u.id
             WHERE b.provider_id = ? AND b.status = 'pending'
             ORDER BY b.created_at DESC`,
            [providerId]
        );

        res.json({
            success: true,
            data: requests
        });

    } catch (error) {
        console.error('Booking requests error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Accept booking request
// @route   PUT /api/provider/requests/:id/accept
const acceptBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const providerId = req.user.id;

        // Check if booking belongs to this provider
        const [booking] = await pool.execute(
            'SELECT * FROM bookings WHERE id = ? AND provider_id = ?',
            [bookingId, providerId]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Booking not found']
            });
        }

        // Update booking status
        await pool.execute(
            'UPDATE bookings SET status = "accepted" WHERE id = ?',
            [bookingId]
        );

        res.json({
            success: true,
            message: 'Booking accepted successfully'
        });

    } catch (error) {
        console.error('Accept booking error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Decline booking request
// @route   PUT /api/provider/requests/:id/decline
const declineBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const providerId = req.user.id;

        const [booking] = await pool.execute(
            'SELECT * FROM bookings WHERE id = ? AND provider_id = ?',
            [bookingId, providerId]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Booking not found']
            });
        }

        await pool.execute(
            'UPDATE bookings SET status = "declined" WHERE id = ?',
            [bookingId]
        );

        res.json({
            success: true,
            message: 'Booking declined'
        });

    } catch (error) {
        console.error('Decline booking error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get today's jobs
// @route   GET /api/provider/jobs/today
const getTodaysJobs = async (req, res) => {
    try {
        const providerId = req.user.id;

        const [jobs] = await pool.execute(
            `SELECT b.*, u.full_name as customer_name, u.phone, u.location 
             FROM bookings b
             JOIN users u ON b.customer_id = u.id
             WHERE b.provider_id = ? AND DATE(b.date) = CURDATE()
             ORDER BY b.time ASC`,
            [providerId]
        );

        res.json({
            success: true,
            data: jobs
        });

    } catch (error) {
        console.error('Today jobs error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Update job status
// @route   PUT /api/provider/jobs/:id/status
const updateJobStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { status } = req.body; // 'in-progress' or 'completed'
        const providerId = req.user.id;

        const [job] = await pool.execute(
            'SELECT * FROM bookings WHERE id = ? AND provider_id = ?',
            [jobId, providerId]
        );

        if (job.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Job not found']
            });
        }

        await pool.execute(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, jobId]
        );

        // If job completed, create payment record
        if (status === 'completed') {
            await pool.execute(
                `INSERT INTO payments (booking_id, customer_id, provider_id, amount, status) 
                 SELECT ?, customer_id, provider_id, price, 'pending' 
                 FROM bookings WHERE id = ?`,
                [jobId, jobId]
            );
        }

        res.json({
            success: true,
            message: `Job marked as ${status}`
        });

    } catch (error) {
        console.error('Update job status error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get earnings
// @route   GET /api/provider/earnings
const getEarnings = async (req, res) => {
    try {
        const providerId = req.user.id;

        // Get earnings summary
        const [summary] = await pool.execute(
            `SELECT 
                COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) as today,
                COALESCE(SUM(CASE WHEN WEEK(created_at) = WEEK(CURDATE()) THEN amount ELSE 0 END), 0) as week,
                COALESCE(SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) THEN amount ELSE 0 END), 0) as month,
                COALESCE(SUM(amount), 0) as total
             FROM payments 
             WHERE provider_id = ? AND status = 'completed'`,
            [providerId]
        );

        // Get recent transactions
        const [transactions] = await pool.execute(
            `SELECT p.*, u.full_name as customer_name, b.service 
             FROM payments p
             JOIN users u ON p.customer_id = u.id
             JOIN bookings b ON p.booking_id = b.id
             WHERE p.provider_id = ?
             ORDER BY p.created_at DESC
             LIMIT 10`,
            [providerId]
        );

        // Get available for payout
        const [available] = await pool.execute(
            `SELECT COALESCE(SUM(amount), 0) as available 
             FROM payments 
             WHERE provider_id = ? AND status = 'completed' AND payout_status = 'pending'`,
            [providerId]
        );

        res.json({
            success: true,
            data: {
                summary: summary[0],
                transactions,
                availableForPayout: available[0].available
            }
        });

    } catch (error) {
        console.error('Earnings error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get provider profile
// @route   GET /api/provider/profile
const getProviderProfile = async (req, res) => {
    try {
        const providerId = req.user.id;

        const [profile] = await pool.execute(
            `SELECT id, full_name, email, phone, location, profile_image, 
                    is_verified, created_at,
                    (SELECT AVG(rating) FROM reviews WHERE provider_id = ?) as rating,
                    (SELECT COUNT(*) FROM bookings WHERE provider_id = ?) as total_jobs
             FROM users 
             WHERE id = ?`,
            [providerId, providerId, providerId]
        );

        if (profile.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Profile not found']
            });
        }

        res.json({
            success: true,
            data: profile[0]
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Update provider profile
// @route   PUT /api/provider/profile
const updateProviderProfile = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { phone, location, profile_image, services, hourly_rate, bio } = req.body;

        // Update basic info
        await pool.execute(
            `UPDATE users 
             SET phone = ?, location = ?, profile_image = ?
             WHERE id = ?`,
            [phone, location, profile_image, providerId]
        );

        // Update or insert provider details
        const [existing] = await pool.execute(
            'SELECT * FROM provider_details WHERE provider_id = ?',
            [providerId]
        );

        if (existing.length > 0) {
            await pool.execute(
                `UPDATE provider_details 
                 SET services = ?, hourly_rate = ?, bio = ?, updated_at = NOW()
                 WHERE provider_id = ?`,
                [JSON.stringify(services), hourly_rate, bio, providerId]
            );
        } else {
            await pool.execute(
                `INSERT INTO provider_details (provider_id, services, hourly_rate, bio) 
                 VALUES (?, ?, ?, ?)`,
                [providerId, JSON.stringify(services), hourly_rate, bio]
            );
        }

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

module.exports = {
    getDashboard,
    getBookingRequests,
    acceptBooking,
    declineBooking,
    getTodaysJobs,
    updateJobStatus,
    getEarnings,
    getProviderProfile,
    updateProviderProfile
};