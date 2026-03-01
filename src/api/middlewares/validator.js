const Joi = require('joi');

exports.validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            details: error.details.map(d => d.message)
        });
    }
    next();
};

exports.serviceRequestSchema = Joi.object({
    service_type: Joi.string().valid('doctor', 'ambulance', 'rehab', 'physio').required(),
    details: Joi.object().required(),
    location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).optional()
});

exports.otpSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
});

exports.verifyOtpSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    otp: Joi.string().length(6).required()
});

exports.profileUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    address: Joi.string().min(5),
    emergency_contact: Joi.string().pattern(/^[0-9]{10,15}$/)
});
