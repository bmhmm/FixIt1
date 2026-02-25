const { pool } = require('../config/database');

// @desc    Get customer dashboard stats
// @route   GET /api/customer/dashboard
const getDashboard = async (req, res) => {
    try {
        const customerId = req.user.id;

        // Get total bookings
        const [totalBookings] = await pool.execute(
            `SELECT COUNT(*) as count FROM bookings WHERE customer_id = ?`,
            [customerId]
        );

        // Get upcoming bookings
        const [upcomingBookings] = await pool.execute(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE customer_id = ? AND status = 'accepted' AND date >= CURDATE()`,
            [customerId]
        );

        // Get completed bookings
        const [completedBookings] = await pool.execute(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE customer_id = ? AND status = 'completed'`,
            [customerId]
        );

        // Get favorites count
        const [favorites] = await pool.execute(
            `SELECT COUNT(*) as count FROM favorites WHERE customer_id = ?`,
            [customerId]
        );

        // Get recent providers (for recommendations)
        const [recentProviders] = await pool.execute(
            `SELECT u.id, u.full_name, u.location, 
                    AVG(r.rating) as rating,
                    pd.hourly_rate,
                    pd.services
             FROM users u
             LEFT JOIN provider_details pd ON u.id = pd.provider_id
             LEFT JOIN reviews r ON u.id = r.provider_id
             WHERE u.user_type = 'provider' AND u.is_active = 1
             GROUP BY u.id
             ORDER BY RAND()
             LIMIT 3`,
            []
        );

        res.json({
            success: true,
            data: {
                totalBookings: totalBookings[0].count,
                upcomingBookings: upcomingBookings[0].count,
                completedBookings: completedBookings[0].count,
                favoriteProviders: favorites[0].count,
                recommendations: recentProviders.map(p => ({
                    ...p,
                    rating: p.rating ? Number(p.rating).toFixed(1) : '0.0',
                    services: p.services ? JSON.parse(p.services) : []
                }))
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

// @desc    Get all providers with filters
// @route   GET /api/customer/providers
const getProviders = async (req, res) => {
    try {
        const { category, search, sort = 'rating', minPrice, maxPrice } = req.query;

        let query = `
            SELECT u.id, u.full_name, u.location, u.profile_image,
                   pd.hourly_rate, pd.services, pd.bio,
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(DISTINCT r.id) as reviews_count,
                   COUNT(DISTINCT b.id) as jobs_completed
            FROM users u
            LEFT JOIN provider_details pd ON u.id = pd.provider_id
            LEFT JOIN reviews r ON u.id = r.provider_id
            LEFT JOIN bookings b ON u.id = b.provider_id AND b.status = 'completed'
            WHERE u.user_type = 'provider' AND u.is_active = 1
        `;

        const params = [];

        // Filter by category
        if (category && category !== 'all') {
            query += ` AND pd.services LIKE ?`;
            params.push(`%${category}%`);
        }

        // Search by name or location
        if (search) {
            query += ` AND (u.full_name LIKE ? OR u.location LIKE ? OR pd.bio LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Price range
        if (minPrice) {
            query += ` AND pd.hourly_rate >= ?`;
            params.push(minPrice);
        }
        if (maxPrice) {
            query += ` AND pd.hourly_rate <= ?`;
            params.push(maxPrice);
        }

        query += ` GROUP BY u.id`;

        // Sorting
        switch(sort) {
            case 'rating':
                query += ` ORDER BY rating DESC`;
                break;
            case 'reviews':
                query += ` ORDER BY reviews_count DESC`;
                break;
            case 'price_low':
                query += ` ORDER BY pd.hourly_rate ASC`;
                break;
            case 'price_high':
                query += ` ORDER BY pd.hourly_rate DESC`;
                break;
            default:
                query += ` ORDER BY rating DESC`;
        }

        const [providers] = await pool.execute(query, params);

        // Check if each provider is favorited by current user
        const customerId = req.user.id;
        const [favorites] = await pool.execute(
            `SELECT provider_id FROM favorites WHERE customer_id = ?`,
            [customerId]
        );
        const favoriteIds = new Set(favorites.map(f => f.provider_id));

        const formattedProviders = providers.map(p => ({
            id: p.id,
            name: p.full_name,
            location: p.location || 'Location not set',
            profile_image: p.profile_image,
            hourly_rate: p.hourly_rate || 0,
            rating: Number(p.rating).toFixed(1),
            reviews: p.reviews_count || 0,
            jobs_completed: p.jobs_completed || 0,
            bio: p.bio,
            services: p.services ? JSON.parse(p.services) : [],
            is_favorite: favoriteIds.has(p.id)
        }));

        res.json({
            success: true,
            data: formattedProviders
        });

    } catch (error) {
        console.error('Get providers error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get single provider by ID
// @route   GET /api/customer/provider/:id
const getProviderById = async (req, res) => {
    try {
        const providerId = req.params.id;
        const customerId = req.user.id;

        const [providers] = await pool.execute(
            `SELECT u.id, u.full_name, u.email, u.phone, u.location, 
                    u.profile_image, u.is_verified, u.created_at,
                    pd.hourly_rate, pd.services, pd.bio,
                    COALESCE(AVG(r.rating), 0) as rating,
                    COUNT(DISTINCT r.id) as reviews_count,
                    COUNT(DISTINCT b.id) as jobs_completed,
                    (SELECT COUNT(*) FROM reviews WHERE provider_id = u.id) as total_reviews
             FROM users u
             LEFT JOIN provider_details pd ON u.id = pd.provider_id
             LEFT JOIN reviews r ON u.id = r.provider_id
             LEFT JOIN bookings b ON u.id = b.provider_id AND b.status = 'completed'
             WHERE u.id = ? AND u.user_type = 'provider'
             GROUP BY u.id`,
            [providerId]
        );

        if (providers.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Provider not found']
            });
        }

        // Check if provider is favorited
        const [favorites] = await pool.execute(
            `SELECT * FROM favorites WHERE customer_id = ? AND provider_id = ?`,
            [customerId, providerId]
        );

        // Get provider's reviews
        const [reviews] = await pool.execute(
            `SELECT r.*, u.full_name as customer_name, u.profile_image 
             FROM reviews r
             JOIN users u ON r.customer_id = u.id
             WHERE r.provider_id = ?
             ORDER BY r.created_at DESC`,
            [providerId]
        );

        const provider = providers[0];
        
        // Get rating distribution
        const [ratingDistribution] = await pool.execute(
            `SELECT rating, COUNT(*) as count 
             FROM reviews 
             WHERE provider_id = ? 
             GROUP BY rating 
             ORDER BY rating DESC`,
            [providerId]
        );

        const distribution = {
            5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        };
        ratingDistribution.forEach(r => {
            distribution[r.rating] = r.count;
        });

        res.json({
            success: true,
            data: {
                id: provider.id,
                name: provider.full_name,
                email: provider.email,
                phone: provider.phone,
                location: provider.location || 'Location not set',
                profile_image: provider.profile_image,
                hourly_rate: provider.hourly_rate || 0,
                rating: Number(provider.rating).toFixed(1),
                reviews_count: provider.reviews_count || 0,
                jobs_completed: provider.jobs_completed || 0,
                bio: provider.bio,
                services: provider.services ? JSON.parse(provider.services) : [],
                is_verified: provider.is_verified,
                member_since: provider.created_at,
                is_favorite: favorites.length > 0,
                reviews: reviews.map(r => ({
                    id: r.id,
                    rating: r.rating,
                    comment: r.comment,
                    customer_name: r.customer_name,
                    customer_image: r.profile_image,
                    date: r.created_at
                })),
                rating_distribution: distribution
            }
        });

    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Create new booking
// @route   POST /api/customer/bookings
const createBooking = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { provider_id, service, date, time, duration, address, description, urgent } = req.body;

        // Validate required fields
        if (!provider_id || !service || !date || !time || !address) {
            return res.status(400).json({
                success: false,
                errors: ['Please fill all required fields']
            });
        }

        // Check if provider exists
        const [provider] = await pool.execute(
            'SELECT * FROM users WHERE id = ? AND user_type = "provider"',
            [provider_id]
        );

        if (provider.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Provider not found']
            });
        }

        // Get provider's hourly rate
        const [providerDetails] = await pool.execute(
            'SELECT hourly_rate FROM provider_details WHERE provider_id = ?',
            [provider_id]
        );

        const hourlyRate = providerDetails[0]?.hourly_rate || 0;
        const totalPrice = hourlyRate * parseInt(duration);

        // Create booking
        const [result] = await pool.execute(
            `INSERT INTO bookings 
             (customer_id, provider_id, service, date, time, duration, 
              address, description, urgent, price, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [customerId, provider_id, service, date, time, duration, 
             address, description, urgent ? 1 : 0, totalPrice]
        );

        // Send notification to provider (you can implement this later)
        // await sendNotification(provider_id, 'New booking request');

        res.status(201).json({
            success: true,
            message: 'Booking request sent successfully',
            data: {
                booking_id: result.insertId
            }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get customer's bookings
// @route   GET /api/customer/bookings
const getMyBookings = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { status } = req.query;

        let query = `
            SELECT b.*, 
                   u.full_name as provider_name,
                   u.profile_image as provider_image,
                   pd.hourly_rate
            FROM bookings b
            JOIN users u ON b.provider_id = u.id
            LEFT JOIN provider_details pd ON u.id = pd.provider_id
            WHERE b.customer_id = ?
        `;

        const params = [customerId];

        if (status && status !== 'all') {
            query += ` AND b.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY b.created_at DESC`;

        const [bookings] = await pool.execute(query, params);

        res.json({
            success: true,
            data: bookings.map(b => ({
                id: b.id,
                provider_id: b.provider_id,
                provider_name: b.provider_name,
                provider_image: b.provider_image,
                service: b.service,
                date: b.date,
                time: b.time,
                duration: b.duration,
                address: b.address,
                description: b.description,
                price: b.price,
                status: b.status,
                urgent: b.urgent === 1,
                created_at: b.created_at
            }))
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/customer/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const customerId = req.user.id;

        // Check if booking exists and belongs to customer
        const [booking] = await pool.execute(
            'SELECT * FROM bookings WHERE id = ? AND customer_id = ?',
            [bookingId, customerId]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                errors: ['Booking not found']
            });
        }

        // Check if booking can be cancelled (only pending or accepted)
        if (!['pending', 'accepted'].includes(booking[0].status)) {
            return res.status(400).json({
                success: false,
                errors: ['Cannot cancel this booking']
            });
        }

        // Update booking status
        await pool.execute(
            'UPDATE bookings SET status = "cancelled" WHERE id = ?',
            [bookingId]
        );

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Add review for provider
// @route   POST /api/customer/reviews
const addReview = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { provider_id, booking_id, rating, comment } = req.body;

        // Validate
        if (!provider_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                errors: ['Please provide valid rating (1-5)']
            });
        }

        // Check if booking exists and is completed
        if (booking_id) {
            const [booking] = await pool.execute(
                'SELECT * FROM bookings WHERE id = ? AND customer_id = ? AND provider_id = ? AND status = "completed"',
                [booking_id, customerId, provider_id]
            );

            if (booking.length === 0) {
                return res.status(400).json({
                    success: false,
                    errors: ['Can only review completed bookings']
                });
            }
        }

        // Check if already reviewed
        const [existing] = await pool.execute(
            'SELECT * FROM reviews WHERE customer_id = ? AND provider_id = ? AND booking_id = ?',
            [customerId, provider_id, booking_id || null]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                errors: ['You have already reviewed this booking']
            });
        }

        // Add review
        await pool.execute(
            `INSERT INTO reviews (customer_id, provider_id, booking_id, rating, comment) 
             VALUES (?, ?, ?, ?, ?)`,
            [customerId, provider_id, booking_id || null, rating, comment]
        );

        res.status(201).json({
            success: true,
            message: 'Review added successfully'
        });

    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Get customer's favorites
// @route   GET /api/customer/favorites
const getFavorites = async (req, res) => {
    try {
        const customerId = req.user.id;

        const [favorites] = await pool.execute(
            `SELECT u.id, u.full_name, u.location, u.profile_image,
                    pd.hourly_rate,
                    COALESCE(AVG(r.rating), 0) as rating,
                    COUNT(DISTINCT r.id) as reviews_count
             FROM favorites f
             JOIN users u ON f.provider_id = u.id
             LEFT JOIN provider_details pd ON u.id = pd.provider_id
             LEFT JOIN reviews r ON u.id = r.provider_id
             WHERE f.customer_id = ?
             GROUP BY u.id`,
            [customerId]
        );

        res.json({
            success: true,
            data: favorites.map(f => ({
                id: f.id,
                name: f.full_name,
                location: f.location,
                profile_image: f.profile_image,
                hourly_rate: f.hourly_rate || 0,
                rating: Number(f.rating).toFixed(1),
                reviews: f.reviews_count || 0
            }))
        });

    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Add provider to favorites
// @route   POST /api/customer/favorites/:id
const addFavorite = async (req, res) => {
    try {
        const customerId = req.user.id;
        const providerId = req.params.id;

        // Check if already favorited
        const [existing] = await pool.execute(
            'SELECT * FROM favorites WHERE customer_id = ? AND provider_id = ?',
            [customerId, providerId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                errors: ['Already in favorites']
            });
        }

        // Add to favorites
        await pool.execute(
            'INSERT INTO favorites (customer_id, provider_id) VALUES (?, ?)',
            [customerId, providerId]
        );

        res.json({
            success: true,
            message: 'Added to favorites'
        });

    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

// @desc    Remove provider from favorites
// @route   DELETE /api/customer/favorites/:id
const removeFavorite = async (req, res) => {
    try {
        const customerId = req.user.id;
        const providerId = req.params.id;

        await pool.execute(
            'DELETE FROM favorites WHERE customer_id = ? AND provider_id = ?',
            [customerId, providerId]
        );

        res.json({
            success: true,
            message: 'Removed from favorites'
        });

    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error']
        });
    }
};

module.exports = {
    getDashboard,
    getProviders,
    getProviderById,
    createBooking,
    getMyBookings,
    cancelBooking,
    addReview,
    addFavorite,
    removeFavorite,
    getFavorites
};