import db from "../config/db.js";
import { buildCombineWhereClause, buildFilterClause, countServices, createServices, deleteServices, findAllServices, findOneServices, updateServices } from "../services/dbServices.js";
const TABLE_NAME = "organizations"
const MEMBER_TABLE_NAME = "organization_members"

async function findAll(queryOptions) {
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions
    })
};

/**
 * Mencari semua organisasi di mana pengguna adalah anggota,
 * dengan dukungan untuk paginasi, sorting, dan filter.
 * @param {object} queryOptions - Opsi dari client { pagination, sorts, filters }
 * @param {number|string} userId - ID pengguna yang sedang login
 * @returns {Promise<Array>}
 */
async function findAllForMember({ queryOptions, user_id }) {
    const { pagination, sorts, filters } = queryOptions;
    const { limit, offset } = pagination;

    // condition for filter organization member
    const baseWhereClause = `om."user_id" = $1`;
    let queryValues = [user_id];

    const { clause: filterClause, values: filterValues } = buildFilterClause(filters, 2);
    queryValues.push(...filterValues);

    let finalWhereClause = `WHERE ${baseWhereClause}`;
    if (filterClause) {
        finalWhereClause += ` AND (${filterClause})`;
    }

    const orderByClause = sorts.map(srt => `"org"."${srt.field}" ${srt.direction}`).join(", ");
    const limitPLaceholder = `$${queryValues.length + 1}`;
    const offsetPlaceholder = `$${queryValues.length + 2}`;

    const sqlQuery = `
        SELECT org.*
        FROM ${TABLE_NAME} AS org
        JOIN ${MEMBER_TABLE_NAME} AS om ON org.id = om.organization_id
        ${finalWhereClause}
        ORDER BY ${orderByClause}
        LIMIT ${limitPLaceholder}
        OFFSET ${offsetPlaceholder}
    `
    const { rows } = await db.query(sqlQuery, [...queryValues, limit, offset]);
    return rows
}

/**
 * Menghitung jumlah total organisasi di mana pengguna adalah anggota.
 * @param {object} queryOptions - Opsi dari client { filters }
 * @param {number|string} userId - ID pengguna yang sedang login
 * @returns {Promise<number>}
 */
async function countForMember({ queryOptions, user_id }) {
    const { filters } = queryOptions;

    const baseWhereClause = `om."user_id" = $1`;
    let queryValues = [user_id];

    const { clause: filterClause, values: filterValues } = buildFilterClause(filters, 2);
    queryValues.push(...filterValues);

    let finalWhereClause = `WHERE ${baseWhereClause}`;
    if (filterClause) {
        finalWhereClause += ` AND (${filterClause})`;
    }


    const sqlQuery = `
        SELECT COUNT(org.id)
        FROM ${TABLE_NAME} AS org
        JOIN ${MEMBER_TABLE_NAME} AS om ON org.id = om.organization_id
        ${finalWhereClause}
    `;

    const { rows } = await db.query(sqlQuery, queryValues);
    return rows[0].count;
}

async function findById({ id }) {
    return findOneServices({
        tableName: TABLE_NAME,
        conditions: { id }
    })
}

async function findByOwner({ owner_id }) {
    return findOneServices({
        tableName: TABLE_NAME,
        conditions: { owner_id }
    })
}

async function countOfOrganization(queryOptions) {
    return countServices({
        tableName: TABLE_NAME,
        queryOptions
    })
};

async function create({ data = {}, db }) {
    return createServices({
        tableName: TABLE_NAME,
        data,
        db
    })
};

async function update({ data, id }) {
    return updateServices({
        tableName: TABLE_NAME,
        data,
        id
    })
};

async function deleteData({ id }) {
    return deleteServices({ tableName: TABLE_NAME, id })
}

export default {
    findAll,
    findAllForMember,
    findById,
    findByOwner,
    countOfOrganization,
    countForMember,
    create,
    update,
    deleteData
}