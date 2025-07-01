import db from "../config/db.js";
import bcrypt from "bcrypt";
const saltRound = 12;

async function findAll() {
    const sqlQuery = 'SELECT * FROM users'
    const { rows } = await db.query(sqlQuery);
    return rows
};

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

    if (!existingUser) {
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
    console.log(email, password)
    const emailValid = await findByEmail({ email });
    console.log(emailValid)

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
}

export default {
    findAll,
    findByEmail,
    findByCredentials,
    create
}

