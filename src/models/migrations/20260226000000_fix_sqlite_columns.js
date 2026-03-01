/**
 * Migration: Fix column types for SQLite dev compatibility.
 * The initial migration used `jsonb` and `specificType('POINT')` which are
 * PostgreSQL-only. SQLite will have created them as text anyway, but this
 * migration documents the intent cleanly and is a no-op on SQLite.
 *
 * In production (PostgreSQL), details stays jsonb and location stays text
 * (we store location as JSON string for lat/lng, POINT type removed for
 * cross-DB compatibility).
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const client = knex.client.config.client;

    if (client === 'sqlite3' || client === 'sqlite') {
        // SQLite: columns already created as text by the initial migration
        // No alterations needed – SQLite doesn't support column type changes anyway
        console.log('[Migration] SQLite detected – skipping column type fix (no-op)');
        return;
    }

    // PostgreSQL: ensure location column is text (JSON string), not POINT
    // (POINT requires geospatial extension and is unnecessary for simple lat/lng storage)
    const hasLocation = await knex.schema.hasColumn('service_requests', 'location');
    if (hasLocation) {
        await knex.schema.alterTable('service_requests', (table) => {
            table.text('location').alter();
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Nothing to undo safely
};
