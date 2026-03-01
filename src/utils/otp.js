const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const verifyOTP = (input, stored) => {
    // In production, this would compare against a Redis/DB value with expiration
    return input === stored;
};

module.exports = {
    generateOTP,
    verifyOTP
};
