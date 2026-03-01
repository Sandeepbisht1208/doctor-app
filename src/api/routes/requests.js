const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/auth');

const { validate, serviceRequestSchema } = require('../middlewares/validator');

// All request routes require authentication
router.use(authMiddleware);

router.post('/create', validate(serviceRequestSchema), requestController.createRequest);
router.get('/my-requests', requestController.getMyRequests);
router.get('/my-visits', requestController.getMyVisits);

module.exports = router;
