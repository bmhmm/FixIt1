const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/customerController');

// All routes are protected - only logged in customers can access
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboard);

// Providers
router.get('/provider', getProviders);
router.get('/provider/:id', getProviderById);

// Bookings
router.post('/bookings', createBooking);
router.get('/bookings', getMyBookings);
router.put('/bookings/:id/cancel', cancelBooking);

// Reviews
router.post('/reviews', addReview);

// Favorites
router.get('/favorites', getFavorites);
router.post('/favorites/:id', addFavorite);
router.delete('/favorites/:id', removeFavorite);

module.exports = router;