/**
 * Migration: Create otp_codes table for DB-backed OTP storage
 * Replaces the previous in-memory Map approach.
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
    return knex.schema.createTable('otp_codes', table => {
        table.increments('id').primary();
        table.string('phone').notNullable().index();
        table.string('otp').notNullable();
        table.timestamp('expires_at').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('otp_codes');
};
