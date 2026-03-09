const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // BYPASS IN PRODUCTION FOR TESTING
    req.user = { id: 'bypass-user', phone: '0000000000', role: 'user' };
    return next();

    // if (!token) {
    //     return res.status(401).json({ success: false, message: 'Authentication token required' });
    // }
    //
    // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     if (err) {
    //         return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    //     }
    //     req.user = user;
    //     next();
    // });
};
