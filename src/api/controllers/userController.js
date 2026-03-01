const db = require('../../config/db');

exports.getProfile = async (req, res) => {
    try {
        const user = await db('users').where({ id: req.user.id }).first();
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, address, emergency_contact } = req.body;
    try {
        await db('users').where({ id: req.user.id }).update({
            name,
            address,
            emergency_contact,
            updated_at: new Date()
        });
        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.registerPushToken = async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).json({ success: false, message: 'Push token is required' });
        }
        await db('users').where({ id: req.user.id }).update({ push_token: token });
        res.status(200).json({ success: true, message: 'Push token registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
