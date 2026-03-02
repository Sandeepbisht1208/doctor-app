// make-admin.js
require('dotenv').config();
const db = require('./src/config/db');

async function makeAdmin() {
    const phone = process.argv[2];

    if (!phone) {
        console.error('Please provide a phone number: node make-admin.js <phone>');
        process.exit(1);
    }

    try {
        const user = await db('users').where({ phone }).first();

        if (!user) {
            console.log(`User ${phone} not found. Please log in once first on the user app to create the account, or we can create it now.`);

            // Create the user as admin directly
            const crypto = require('crypto');
            await db('users').insert({
                id: crypto.randomUUID(),
                phone: phone,
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            });
            console.log(`✅ Success! Created new admin user with phone: ${phone}`);
        } else {
            // Update existing user to admin
            await db('users').where({ phone }).update({ role: 'admin' });
            console.log(`✅ Success! Updated existing user ${phone} to admin.`);
        }
    } catch (err) {
        console.error('Error making admin:', err);
    } finally {
        process.exit(0);
    }
}

makeAdmin();
