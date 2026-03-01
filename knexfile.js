require('dotenv').config();

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './dev.sqlite3',
        },
        useNullAsDefault: true,
        migrations: {
            directory: './src/models/migrations',
        },
        seeds: {
            directory: './src/models/seeds',
        },
    },
    production: {
        client: process.env.DB_CLIENT || 'pg',
        connection: process.env.DATABASE_URL || {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false } // Required for most managed PostgreSQL hosts
        },
        migrations: {
            directory: './src/models/migrations',
        },
        pool: {
            min: 2,
            max: 10
        }
    },
};

