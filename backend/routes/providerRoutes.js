const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getDashboard,
    getBookingRequests,
    acceptBooking,
    declineBooking,
    getTodaysJobs,
    updateJobStatus,
    getEarnings,
    getProviderProfile,
    updateProviderProfile
} = require('../controllers/providerController');

// All routes are protected - only logged in providers can access
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboard);

// Booking requests
router.get('/requests', getBookingRequests);
router.put('/requests/:id/accept', acceptBooking);
router.put('/requests/:id/decline', declineBooking);

// Today's jobs
router.get('/jobs/today', getTodaysJobs);
router.put('/jobs/:id/status', updateJobStatus);

// Earnings
router.get('/earnings', getEarnings);

// Profile
router.get('/profile', getProviderProfile);
router.put('/profile', updateProviderProfile);

module.exports = router;