import db from "../config/db.js";
import bcrypt from "bcrypt";
import { countServices, findAllServices } from "../services/dbServices.js";
const saltRound = 12;
const TABLE_NAME = "users"

async function findAll(queryOptions) {
    const selectQuery = "id, name, email, avatar_url, created_at, updated_at"
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions,
        selectQuery
    })
};

async function countOfUsers(queryOptions) {
    return countServices({ tableName: TABLE_NAME, queryOptions });
}

async function findByEmail({ email }) {
    const checkEmailQuery = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(checkEmailQuery, [email]);


    if (!rows.length) {
        return null;
    };

    return rows[0];
}

async function create({ name, email, password, avatarUrl }) {
    const hashPassword = await bcrypt.hash(password, saltRound);
    const existingUser = await findByEmail({ email });

    if (existingUser !== null) {
        return null;
    }

    const sqlQuery = `INSERT INTO users (name, email, password_hash, avatar_url) 
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, name, email, avatar_url, created_at;`

    const values = [name, email, hashPassword, avatarUrl]
    const { rows } = await db.query(sqlQuery, values);

    return rows[0];
};

async function findByCredentials({ email, password }) {
    const emailValid = await findByEmail({ email });

    if (!emailValid) {
        return null;
    }


    const user = emailValid;
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);


    if (!isPasswordCorrect) {
        return null;
    };

    delete user.password_hash;
    return user;
};

async function updateRefreshToken({ userId, token }) {
    const sqlQuery = `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING id`;
    const { rows } = await db.query(sqlQuery, [token, userId]);
    return rows[0]
};

async function findRefreshToken(token) {
    const sqlQuery = "SELECT * FROM users WHERE refresh_token = $1";
    const { rows } = await db.query(sqlQuery, [token]);
    return rows[0]
}

async function clearRefreshToken({ userId }) {
    const sqlQuery = "UPDATE users SET refresh_token = NULL WHERE id = $1";
    await db.query(sqlQuery, [userId]);
}

export default {
    findAll,
    findByEmail,
    findByCredentials,
    create,
    updateRefreshToken,
    findRefreshToken,
    clearRefreshToken,
    countOfUsers
}

