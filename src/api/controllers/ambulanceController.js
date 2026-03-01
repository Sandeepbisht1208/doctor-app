const db = require('../../config/db');
const crypto = require('crypto');

exports.getAllAmbulances = async (req, res) => {
    try {
        const ambulances = await db('ambulances')
            .leftJoin('staff', 'ambulances.driver_id', 'staff.id')
            .select('ambulances.*', 'staff.name as driver_name');
        res.status(200).json({ success: true, data: ambulances });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addAmbulance = async (req, res) => {
    const { vehicle_number, driver_id } = req.body;
    try {
        const id = crypto.randomUUID();
        await db('ambulances').insert({ id, vehicle_number, driver_id });
        const newAmbulance = await db('ambulances').where({ id }).first();
        res.status(201).json({ success: true, data: newAmbulance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
