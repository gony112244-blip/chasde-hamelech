require('dotenv').config();
const pool = require('./db');

async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS donation_reports (
            id          SERIAL PRIMARY KEY,
            donor_name  TEXT DEFAULT '',
            amount      NUMERIC(10,2),
            method      TEXT DEFAULT 'other',
            email       TEXT DEFAULT '',
            phone       TEXT DEFAULT '',
            note        TEXT DEFAULT '',
            status      TEXT DEFAULT 'pending',
            created_at  TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    console.log('donation_reports table: OK');
    await pool.end();
}

migrate().catch(e => { console.error(e.message); process.exit(1); });
