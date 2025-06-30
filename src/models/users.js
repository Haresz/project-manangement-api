import db from "../config/db.js";
import bcrypt from "bcrypt";
const saltRound = 12;

async function findAll() {
    const sqlQuery = 'SELECT * FROM users'
    const { rows } = await db.query(sqlQuery);
    return rows
};

async function create({ name, email, password, avatarUrl }) {
    console.log(name, email, password)
    const hashPassword = await bcrypt.hash(password, saltRound);

    const checkEmailQuery = `SELECT * FROM users WHERE email = $1`;
    const existingUser = await db.query(checkEmailQuery, [email]);

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exist");
    }

    const sqlQuery = `INSERT INTO users (name, email, password_hash, avatar_url) 
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, name, email, avatar_url, created_at;`

    const values = [name, email, hashPassword, avatarUrl]
    const { rows } = await db.query(sqlQuery, values);

    return rows[0];
};

export default {
    findAll,
    create
}

