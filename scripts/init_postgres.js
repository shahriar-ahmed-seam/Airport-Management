const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function initPostgres() {
    console.log('--- Initializing PostgreSQL Database ---');

    // First connect to default postgres db to ensure target database exists
    const adminPool = new Pool({
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: 'postgres',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
    });

    const targetDb = process.env.PGDATABASE || 'airport_db';

    try {
        const checkDb = await adminPool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [targetDb]
        );
        if (checkDb.rowCount === 0) {
            console.log(`Database '${targetDb}' does not exist. Creating...`);
            await adminPool.query(`CREATE DATABASE "${targetDb}"`);
            console.log(`Database '${targetDb}' created.`);
        } else {
            console.log(`Database '${targetDb}' already exists.`);
        }
    } catch (err) {
        console.warn('Could not verify/create database via admin connection:', err.message);
    } finally {
        await adminPool.end();
    }

    // Now connect to target database
    const pool = new Pool({
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: targetDb,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
    });

    try {
        const sqlDir = path.join(__dirname, '..', 'database', 'postgres');
        const files = [
            '01_tables.sql',
            '02_functions_and_triggers.sql',
            '03_seed.sql'
        ];

        for (const file of files) {
            const filePath = path.join(sqlDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`Executing ${file}...`);
                const sqlContent = fs.readFileSync(filePath, 'utf8');
                await pool.query(sqlContent);
                console.log(`Successfully executed ${file}`);
            }
        }

        console.log('--- PostgreSQL Database Initialization Complete! ---');
    } catch (err) {
        console.error('Error initializing PostgreSQL:', err);
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    initPostgres();
}

module.exports = initPostgres;
