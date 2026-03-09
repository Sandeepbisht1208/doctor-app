const db = require('../../config/db');
const push = require('../../utils/push');
const { Parser } = require('json2csv');

exports.getAllRequests = async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = db('service_requests')
            .leftJoin('users', 'service_requests.user_id', 'users.id')
            .leftJoin('staff', 'service_requests.assigned_staff_id', 'staff.id')
            .select(
                'service_requests.*',
                'users.name as patient_name',
                'users.phone as patient_phone',
                'staff.name as staff_name'
            );

        if (type) query = query.where({ service_type: type });
        if (status) query = query.where({ status });

        const requests = await query.orderBy('created_at', 'desc');

        const formattedRequests = requests.map(req => ({
            ...req,
            patient_name: req.patient_name || 'Dummy Request (Bypass)',
            patient_phone: req.patient_phone || 'No Phone'
        }));

        res.status(200).json({ success: true, data: formattedRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.assignStaff = async (req, res) => {
    const { requestId } = req.params;
    const { staffId, ambulanceId } = req.body;

    try {
        await db('service_requests').where({ id: requestId }).update({
            assigned_staff_id: staffId,
            assigned_ambulance_id: ambulanceId,
            status: 'assigned'
        });

        // Update staff status to busy
        if (staffId) {
            await db('staff').where({ id: staffId }).update({ status: 'busy' });

            // Notification to User
            const request = await db('service_requests')
                .leftJoin('users', 'service_requests.user_id', 'users.id')
                .select(
                    'users.push_token',
                    'users.name as patient_name',
                    'service_requests.service_type'
                )
                .where('service_requests.id', requestId)
                .first();

            const staff = await db('staff').where({ id: staffId }).first();

            if (request && request.push_token) {
                push.sendNotification(
                    request.push_token,
                    'Staff Assigned',
                    `${staff ? staff.name : 'A professional'} has been assigned to your ${request.service_type} request.`
                );
            }

            // Notification to Staff
            if (staff && staff.push_token) {
                push.sendNotification(
                    staff.push_token,
                    'New Assignment',
                    `You have a new ${request ? request.service_type : ''} assignment for ${request ? request.patient_name : 'a patient'}.`
                );
            }
        }

        res.status(200).json({
            success: true,
            message: 'Staff assigned successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    const VALID_STATUSES = ['pending', 'approved', 'assigned', 'on_the_way', 'completed', 'cancelled'];
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    try {
        await db('service_requests').where({ id: requestId }).update({ status });

        // Notification to User on status change
        const request = await db('service_requests')
            .leftJoin('users', 'service_requests.user_id', 'users.id')
            .select('users.push_token', 'service_requests.service_type')
            .where('service_requests.id', requestId)
            .first();

        if (request && request.push_token) {
            let body = '';
            switch (status) {
                case 'on_the_way': body = 'Your service professional is on the way!'; break;
                case 'completed': body = 'Your visit has been marked as completed.'; break;
                case 'cancelled': body = 'Your request has been cancelled.'; break;
            }
            if (body) {
                push.sendNotification(request.push_token, 'Status Update', body);
            }
        }

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await db('service_requests').select(
            db.raw("count(case when created_at >= ? then 1 end) as today", [today]),
            db.raw("count(case when status = 'pending' then 1 end) as pending"),
            db.raw("count(case when service_type = 'ambulance' and status != 'completed' then 1 end) as emergency"),
            db.raw("count(case when status = 'completed' then 1 end) as completed")
        ).first();

        res.status(200).json({
            success: true,
            data: {
                today: stats.today || 0,
                pending: stats.pending || 0,
                emergency: stats.emergency || 0,
                completed: stats.completed || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDetailedAnalytics = async (req, res) => {
    try {
        const client = db.client.config.client;
        const isPostgres = client === 'pg' || client === 'postgres';

        // Service distribution
        const serviceDistribution = await db('service_requests')
            .select('service_type as name')
            .count('id as value')
            .groupBy('service_type');

        // Monthly trends (last 6 months) — SQL dialect dependent
        let monthlyTrends;
        if (isPostgres) {
            monthlyTrends = await db('service_requests')
                .select(db.raw("to_char(created_at, 'YYYY-MM') as month"))
                .count('id as total')
                .where('created_at', '>=', db.raw("NOW() - INTERVAL '6 months'"))
                .groupBy(db.raw("to_char(created_at, 'YYYY-MM')"))
                .orderBy('month', 'asc');
        } else {
            monthlyTrends = await db('service_requests')
                .select(db.raw("strftime('%Y-%m', created_at) as month"))
                .count('id as total')
                .where('created_at', '>=', db.raw("date('now', '-6 months')"))
                .groupBy(db.raw("strftime('%Y-%m', created_at)"))
                .orderBy('month', 'asc');
        }

        res.status(200).json({
            success: true,
            data: {
                serviceDistribution,
                monthlyTrends
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.exportRequests = async (req, res) => {
    try {
        const requests = await db('service_requests')
            .leftJoin('users', 'service_requests.user_id', 'users.id')
            .select(
                'service_requests.id',
                'users.name as patient_name',
                'users.phone as patient_phone',
                'service_requests.service_type',
                'service_requests.status',
                'service_requests.created_at'
            );

        const formattedRequests = requests.map(req => ({
            ...req,
            patient_name: req.patient_name || 'Dummy Request (Bypass)',
            patient_phone: req.patient_phone || 'No Phone'
        }));

        const fields = ['id', 'patient_name', 'patient_phone', 'service_type', 'status', 'created_at'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedRequests);

        res.header('Content-Type', 'text/csv');
        res.attachment(`requests-export-${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
