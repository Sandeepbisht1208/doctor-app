/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .table('users', table => {
            table.string('push_token');
        })
        .table('staff', table => {
            table.string('push_token');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .table('users', table => {
            table.dropColumn('push_token');
        })
        .table('staff', table => {
            table.dropColumn('push_token');
        });
};
