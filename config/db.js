const dotenv = require('dotenv');
dotenv.config();

const clientType = (process.env.DB_CLIENT || 'postgres').toLowerCase();

let pgPool = null;
let oracledb = null;

if (clientType === 'postgres') {
    const { Pool } = require('pg');
    pgPool = new Pool({
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: process.env.PGDATABASE || 'airport_db',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
    });
} else {
    try {
        oracledb = require('oracledb');
        oracledb.autoCommit = true;
    } catch (e) {
        console.warn('oracledb module is not installed or unavailable. Defaulting to PostgreSQL.');
    }
}

const oracleConfig = {
    user: process.env.ORACLE_USER || 'Airport_Management_System',
    password: process.env.ORACLE_PASSWORD || '123',
    connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1522/orclpdb'
};

function normalizeRow(row) {
    if (!row) return row;
    const normalized = Array.isArray(row) ? [...row] : [];
    
    // Copy key-value pairs
    for (const [key, value] of Object.entries(row)) {
        normalized[key] = value;
        normalized[key.toUpperCase()] = value;
        normalized[key.toLowerCase()] = value;
    }

    // If row was an object and not an array, also map numeric indices
    if (!Array.isArray(row)) {
        const values = Object.values(row);
        for (let i = 0; i < values.length; i++) {
            normalized[i] = values[i];
        }
    }
    return normalized;
}

async function query(sqlText, params = {}) {
    if (clientType === 'postgres' || !oracledb) {
        if (!pgPool) {
            const { Pool } = require('pg');
            pgPool = new Pool({
                host: process.env.PGHOST || 'localhost',
                port: parseInt(process.env.PGPORT || '5432', 10),
                database: process.env.PGDATABASE || 'airport_db',
                user: process.env.PGUSER || 'postgres',
                password: process.env.PGPASSWORD || 'postgres',
            });
        }

        // Convert Oracle syntax (:name) to Postgres positional params ($1, $2)
        let pgSql = sqlText;
        // Remove FROM DUAL if present
        pgSql = pgSql.replace(/\s+FROM\s+DUAL\b/gi, '');
        // Replace TO_DATE(:var, 'YYYY-MM-DD') with :var::date if needed or let TO_DATE function run
        
        const paramValues = [];
        const paramRegex = /:([a-zA-Z0-9_]+)/g;
        let match;
        let index = 1;
        const keyToIndex = {};

        pgSql = pgSql.replace(paramRegex, (fullMatch, paramName) => {
            if (!(paramName in keyToIndex)) {
                keyToIndex[paramName] = index++;
                paramValues.push(params[paramName]);
            }
            return `$${keyToIndex[paramName]}`;
        });

        const res = await pgPool.query(pgSql, paramValues);
        const rows = res.rows.map(normalizeRow);
        return {
            rows,
            rowCount: res.rowCount
        };
    } else {
        let connection;
        try {
            connection = await oracledb.getConnection(oracleConfig);
            const res = await connection.execute(sqlText, params, {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
            });
            const rows = (res.rows || []).map(normalizeRow);
            return {
                rows,
                rowCount: res.rowsAffected || rows.length
            };
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error('Error closing Oracle connection:', err);
                }
            }
        }
    }
}

module.exports = {
    query,
    clientType,
    pgPool
};
