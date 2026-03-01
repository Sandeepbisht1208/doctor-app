const db = require('../../config/db');
const crypto = require('crypto');

exports.getAllStaff = async (req, res) => {
    try {
        const staff = await db('staff').select('*');
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addStaff = async (req, res) => {
    const { name, phone, role } = req.body;
    try {
        const id = crypto.randomUUID();
        await db('staff').insert({ id, name, phone, role });
        const newStaff = await db('staff').where({ id }).first();
        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStaffStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db('staff').where({ id }).update({ status });
        res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
