import { Pool } from "pg";
import 'dotenv/config';

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    max: 10
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Successfully connected to the PostgreSQL database.');
        console.log('Connected at:', res.rows[0].now);
    }
});

export default {
    query: (text, params) => pool.query(text, params),
    pool: pool
};
