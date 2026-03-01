const jwt = require('jsonwebtoken');
const { generateOTP, verifyOTP } = require('../../utils/otp');
const db = require('../../config/db');
const crypto = require('crypto');

exports.sendOTP = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required' });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000);

    try {
        // Delete any existing OTP for this phone, then insert new one
        await db('otp_codes').where({ phone }).delete();
        await db('otp_codes').insert({ phone, otp, expires_at: expiresAt });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to generate OTP' });
    }

    // In production: integrate an SMS gateway here (Twilio, MSG91, etc.)
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV AUTH] OTP for ${phone}: ${otp}`);
    }

    res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
    });
};

exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP are required' });

    const storedData = await db('otp_codes').where({ phone }).first();
    if (!storedData || new Date(storedData.expires_at) < new Date()) {
        return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

    if (verifyOTP(otp, storedData.otp)) {
        // Clear OTP from DB
        await db('otp_codes').where({ phone }).delete();

        try {
            // Find or create user
            let user = await db('users').where({ phone }).first();

            if (!user) {
                const id = crypto.randomUUID();
                await db('users').insert({
                    id,
                    phone,
                    role: 'user',
                    created_at: new Date(),
                    updated_at: new Date()
                });
                user = await db('users').where({ id }).first();
            }

            const token = jwt.sign(
                { id: user.id, phone: user.phone, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                success: true,
                token,
                user
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Database error: ' + error.message });
        }
    }

    res.status(400).json({ success: false, message: 'Invalid OTP' });
};
