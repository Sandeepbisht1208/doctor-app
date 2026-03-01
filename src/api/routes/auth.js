const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { validate, otpSchema, verifyOtpSchema } = require('../middlewares/validator');

router.post('/send-otp', validate(otpSchema), authController.sendOTP);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOTP);

module.exports = router;
