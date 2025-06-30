import db from "../config/db.js";
import bycrypt from "bcrypt";
const saltRound = 12;

async function findAll() {
    const sqlQuery = 'SELECT * FROM users'
    const { rows } = await db.query(sqlQuery);
    return rows
};

async function create({ name, email, password, avatarUrl }) {
    const hashPassword = await bycrypt.hash(password, saltRound);

    const sqlQuery = "INSET INTO users (name, email, password_hash, avatar_url) VALUES ($1, $2, $3, $4);"
    const values = [name, email, hashPassword, avatarUrl]
    const { rows } = await db.query(sqlQuery, values);

    return rows;
}

export default {
    findAll,
    create
}

