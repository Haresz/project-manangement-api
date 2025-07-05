import db from "../config/db.js";
import bcrypt from "bcrypt";
const saltRound = 12;

async function findAll({ limit, offset, sorts, filters = [] }) {
    const queryValues = [limit, offset];
    let whereClause = "";

    if (filters.length > 0) {
        const whereCondition = filters.map((filter, index) => {
            const { field, operator, value } = filter;
            // use params 3 becausu 1 and 2 use in limit and offset
            const paramIndex = index + 3;

            // mapping operator to SQL dintaks
            switch (operator) {
                case 'eq':
                    queryValues.push(value);
                    return `"${field}" = $${paramIndex}`;
                case 'ne':
                    queryValues.push(value);
                    return `"${field}" != $${paramIndex}`;
                case 'gt':
                    queryValues.push(value);
                    return `"${field}" > $${paramIndex}`;
                case 'gte':
                    queryValues.push(value);
                    return `"${field}" >= $${paramIndex}`;
                case 'lt':
                    queryValues.push(value);
                    return `"${field}" < $${paramIndex}`;
                case 'lte':
                    queryValues.push(value);
                    return `"${field}" <= $${paramIndex}`;
                case 'like':
                    queryValues.push(`%${value}%`);
                    return `"${field}" ILIKE $${paramIndex}`;
                case "in":
                    const inValues = value.split(',');
                    const inPlacholders = inValues.map((val, i) => {
                        queryValues.push(val);
                        return `$${paramIndex + i}`;
                    }).join(',');
                    return `"${field}" IN (${inPlacholders})`

                default:
                    return null;
            }
        }).filter(Boolean);

        if (whereCondition.length > 0) {
            whereClause = `WHERE ${whereCondition.join(" AND ")}`
        }
    }

    const orderByClause = sorts.map(srt => `${srt.field} ${srt.direction}`).join(", ")
    const sqlQuery = `SELECT id, name, email, avatar_url, created_at, updated_at FROM users ${whereClause} ORDER BY ${orderByClause} LIMIT $1 OFFSET $2`
    const { rows } = await db.query(sqlQuery, queryValues);

    return rows
};

async function countOfUsers() {
    const sqlQuery = "SELECT COUNT(*) FROM users";
    const { rows } = await db.query(sqlQuery);
    return rows[0].count
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

