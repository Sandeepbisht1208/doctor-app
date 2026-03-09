const db = require('../../config/db');
const crypto = require('crypto');

exports.createRequest = async (req, res) => {
    const { service_type, details, location } = req.body;
    let user_id = req.user.id;

    if (!['doctor', 'ambulance', 'rehab', 'physio'].includes(service_type)) {
        return res.status(400).json({ success: false, message: 'Invalid service type' });
    }

    try {
        if (user_id === 'bypass-user') {
            const dummy = await db('users').where({ phone: '0000000000' }).first();
            if (dummy) {
                user_id = dummy.id;
            } else {
                user_id = crypto.randomUUID();
                await db('users').insert({ id: user_id, phone: '0000000000', role: 'user' });
            }
        }

        // SQLite doesn't support POINT or returning multiple columns in old versions
        // We'll store location as JSON string for now or lat/lng
        const requestId = crypto.randomUUID();

        await db('service_requests').insert({
            id: requestId,
            user_id: user_id,
            service_type,
            details: JSON.stringify(details),
            location: location ? JSON.stringify(location) : null, // SQLite compatibility
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        });

        const newRequest = await db('service_requests').where({ id: requestId }).first();

        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            data: newRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create request: ' + error.message });
    }
};

exports.getMyRequests = async (req, res) => {
    try {
        const requests = await db('service_requests')
            .where({ user_id: req.user.id })
            .orderBy('created_at', 'desc');
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch requests' });
    }
};

exports.getMyVisits = async (req, res) => {
    try {
        const visits = await db('service_requests')
            .where({ user_id: req.user.id, status: 'completed' })
            .orderBy('created_at', 'desc');
        res.status(200).json({ success: true, data: visits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch visits' });
    }
};
