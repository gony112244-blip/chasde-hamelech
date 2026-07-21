require('dotenv').config();
const { Pool } = require('pg');

// תואם ל-server.js — ריווח/רישיות ב-NODE_ENV לא ישברו זיהוי פרודקשן
const IS_PROD = String(process.env.NODE_ENV || '').trim().toLowerCase() === 'production';

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    // localhost → 127.0.0.1 מונע בעיות IPv6 ב-Windows/Node
    host: process.env.DB_HOST === 'localhost' ? '127.0.0.1' : (process.env.DB_HOST || '127.0.0.1'),
    database: process.env.DB_NAME || 'chasde_hamelech',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    max: Number(process.env.PG_POOL_MAX) || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

if (IS_PROD && !process.env.DB_PASSWORD) {
    console.error('⚠️  אזהרה: DB_PASSWORD לא מוגדר בפרודקשן');
}

pool.on('error', (err) => {
    console.error('❌ שגיאת DB:', err.message);
});

module.exports = pool;
