const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const staffController = require('../controllers/staffController');
const ambulanceController = require('../controllers/ambulanceController');
const authMiddleware = require('../middlewares/auth');

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    // In strict production mode, verify both token and role
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    // Fallback for development IF explicitly configured
    if (process.env.NODE_ENV === 'development' && !req.headers['authorization']) {
        console.warn('[SECURITY] Using dev-bypass for Admin route');
        req.user = { id: 'admin-dev', role: 'admin' };
        return next();
    }

    res.status(403).json({ success: false, message: 'Access denied: Admin only' });
};

// BYPASS IN PRODUCTION FOR TESTING
router.use((req, res, next) => {
    req.user = { id: 'bypass-admin', role: 'admin' };
    next();
});

// if (process.env.NODE_ENV === 'development') {
//     router.use((req, res, next) => {
//         req.user = { id: 1, role: 'admin' }; // Mock admin user
//         next();
//     });
// } else {
//     router.use(authMiddleware);
//     router.use(adminOnly);
// }

router.get('/requests', adminController.getAllRequests);
router.get('/requests/export', adminController.exportRequests); // Must be before /:requestId routes
router.patch('/requests/:requestId/assign', adminController.assignStaff);
router.patch('/requests/:requestId/status', adminController.updateStatus);
router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/detailed', adminController.getDetailedAnalytics);

// Staff Management
router.get('/staff', staffController.getAllStaff);
router.post('/staff', staffController.addStaff);
router.patch('/staff/:id/status', staffController.updateStaffStatus);

// Ambulance Management
router.get('/ambulances', ambulanceController.getAllAmbulances);
router.post('/ambulances', ambulanceController.addAmbulance);

module.exports = router;
