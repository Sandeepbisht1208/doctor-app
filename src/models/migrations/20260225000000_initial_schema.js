/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', table => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid());
            table.string('name');
            table.string('phone').unique().notNullable();
            table.text('address');
            table.string('emergency_contact');
            table.enum('role', ['user', 'admin']).defaultTo('user');
            table.timestamps(true, true);
        })
        .createTable('staff', table => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid());
            table.string('name').notNullable();
            table.string('phone').unique().notNullable();
            table.enum('role', ['doctor', 'physio', 'rehab', 'driver']).notNullable();
            table.enum('status', ['active', 'inactive', 'busy']).defaultTo('active');
        })
        .createTable('ambulances', table => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid());
            table.string('vehicle_number').unique().notNullable();
            table.uuid('driver_id').references('id').inTable('staff');
            table.enum('status', ['available', 'on_mission', 'maintenance']).defaultTo('available');
        })
        .createTable('service_requests', table => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid());
            table.uuid('user_id').references('id').inTable('users').notNullable();
            table.enum('service_type', ['doctor', 'ambulance', 'rehab', 'physio']).notNullable();
            table.enum('status', ['pending', 'approved', 'assigned', 'on_the_way', 'completed', 'cancelled']).defaultTo('pending');
            table.jsonb('details'); // Stores specific form data
            table.specificType('location', 'POINT'); // For ambulance GPS
            table.uuid('assigned_staff_id').references('id').inTable('staff');
            table.uuid('assigned_ambulance_id').references('id').inTable('ambulances');
            table.timestamps(true, true);
        })
        .createTable('request_logs', table => {
            table.uuid('id').primary().defaultTo(knex.fn.uuid());
            table.uuid('request_id').references('id').inTable('service_requests').onDelete('CASCADE');
            table.string('from_status');
            table.string('to_status');
            table.string('changed_by');
            table.timestamp('timestamp').defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('request_logs')
        .dropTableIfExists('service_requests')
        .dropTableIfExists('ambulances')
        .dropTableIfExists('staff')
        .dropTableIfExists('users');
};
