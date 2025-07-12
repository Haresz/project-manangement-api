import db from "../config/db.js";

const PERMISSIONS = {
    users: {
        creatable: [],
        updatable: ['name', "email"]
    },
    organizations: {
        creatable: ['name', "owner_id"],
        updatable: ['name']
    },
    organization_members: {
        creatable: ["user_id", "organization_id", "role"],
        updatable: ["role"]
    },
    projects: {
        creatable: ["name", "description", "organization_id", "status", "start_date", "end_date"],
        updatable: ["name", "description", "organization_id", "status", "start_date", "end_date"]
    },
    task: {
        creatable: ["title", "description", "project_id", "assignee_id", "reporter_id", "status", "priority", "due_date"],
        updatable: ["title", "description", "project_id", "assignee_id", , "status", "priority", "due_date"],
    },
    comments: {
        creatable: ["content", "user_id", "task_id"],
        updatable: ["content"],
    }
};

// validate columns to create or edit
function validateColumns(tableName, data, operation) {
    const key = operation === 'create' ? 'creatable' : 'updatable';
    const allowedColumns = PERMISSIONS[tableName][key];

    for (const column of Object.keys(data)) {
        if (!allowedColumns.includes(column)) {
            throw new Error(`Kolom '${column}' tidak diizinkan untuk operasi ini.`);
        }
    }
}

// validate tabel
function validateTable(tableName) {
    if (!PERMISSIONS[tableName]) {
        throw new Error(`Tabel '${tableName}' tidak valid`);
    }
}

function buildFilterClause(filters = []) {
    if (!filters || filters.length === 0) {
        return { clause: "", values: [] };
    }

    const queryValues = [];
    let paramCounter = 1;

    const whereConditions = filters.map(filter => {
        const { field, operator, value } = filter;

        switch (operator) {
            case 'eq':
                queryValues.push(value);
                return `"${field}" = $${paramCounter++}`;
            case 'ne':
                queryValues.push(value);
                return `"${field}" != $${paramCounter++}`;
            case 'gt':
                queryValues.push(value);
                return `"${field}" > $${paramCounter++}`;
            case 'gte':
                queryValues.push(value);
                return `"${field}" >= $${paramCounter++}`;
            case 'lt':
                queryValues.push(value);
                return `"${field}" < $${paramCounter++}`;
            case 'lte':
                queryValues.push(value);
                return `"${field}" <= $${paramCounter++}`;
            case 'like':
                queryValues.push(`%${value}%`);
                return `"${field}" ILIKE $${paramCounter++}`;
            case "in":
                const inValues = value.split(',');
                const inPlacholders = inValues.map((val, i) => {
                    queryValues.push(val);
                    return `$${paramCounter++}`;
                }).join(',');
                return `"${field}" IN (${inPlacholders})`

            default:
                return null;
        }
    }).filter(Boolean);

    const clause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
    return { clause, values: queryValues };
}

export async function findAllServices({ tableName, queryOptions, selectQuery = "*" }) {
    validateTable(tableName);

    const { pagination, sorts, filters } = queryOptions;
    const { limit, offset } = pagination;

    const { clause: whereClause, values: filterValues } = buildFilterClause(filters);
    const orderByClause = sorts.map(srt => `"${srt.field}" ${srt.direction}`).join(", ");

    const queryValues = [...filterValues, limit, offset];

    const limitPLaceholder = `$${filterValues.length + 1}`
    const offsetPlaceholder = `$${filterValues.length + 2}`

    const sqlQuery = `
        SELECT ${selectQuery}
        FROM ${tableName}
        ${whereClause}
        ORDER BY ${orderByClause}
        LIMIT ${limitPLaceholder}
        OFFSET ${offsetPlaceholder}
    `;

    const { rows } = await db.query(sqlQuery, queryValues);
    return rows;
}

/**
 * Mencari satu data record berdasarkan kriteria tertentu.
 * @param {object} params - Parameter.
 * @param {string} params.tableName - Nama tabel.
 * @param {object} params.conditions - Objek kondisi untuk klausa WHERE. Contoh: { email: 'user@mail.com' }
 * @returns {Promise<object|null>} Objek data atau null jika tidak ditemukan.
 */
export async function findOneServices({ tableName, conditions }) {
    validateTable(tableName);

    if (Object.keys(conditions).length == 0) {
        throw new Error(`Conditions must be fill`)
    };

    const fields = Object.keys(conditions);
    const values = Object.values(conditions);

    const whereClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(" AND ");

    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${whereClause}`;

    const { rows } = await db.query(sqlQuery, values);
    return rows[0] || null
}

export async function countServices({ tableName, queryOptions }) {
    validateTable(tableName);
    const { clause, values } = buildFilterClause(queryOptions.filters);


    const sqlQuery = `SELECT COUNT(*) FROM ${tableName} ${clause}`;
    const { rows } = await db.query(sqlQuery, values);
    return parseInt(rows[0].count, 10);;
}

export async function createServices({ tableName, data }) {
    validateColumns(tableName, data, 'create');

    const tableColumns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const sqlQuery = `INSERT INTO ${tableName} (${tableColumns}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await db.query(sqlQuery, values);

    return rows;
}

export async function updateServices({ tableName, data, id }) {
    validateColumns(tableName, data, "update")

    console.log(id)
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");

    const queryParams = [...values, id];
    const idPlaceholder = `$${queryParams.length}`;

    const sqlQuery = `UPDATE ${tableName} SET ${setString} WHERE id = ${idPlaceholder} RETURNING *`;

    const { rows } = await db.query(sqlQuery, queryParams);
    return rows[0];
}

/**
 * Menghapus satu data record berdasarkan ID.
 * @param {object} params - Parameter.
 * @param {string} params.tableName - Nama tabel.
 * @param {string|number} params.id - ID dari record yang akan dihapus.
 * @returns {Promise<object|null>} Objek data yang dihapus atau null jika tidak ada yang dihapus.
 */
export async function deleteServices({ tableName, id }) {
    validateTable(tableName);

    const sqlQuery = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(sqlQuery, [id]);

    return rows[0] || null
}