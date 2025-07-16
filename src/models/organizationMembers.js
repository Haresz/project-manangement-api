import db from "../config/db.js"
import { countServices, createServices, deleteServices, findAllServices, findOneServices, updateServices } from "../services/dbServices.js"
const TABEL_NAME = "organization_members"

async function findAll(queryOptions) {
    return findAllServices({
        tableName: TABEL_NAME,
        queryOptions
    })
};

async function findByOrganization({ organization_id, queryOptions }) {
    return findAllServices({
        tableName: TABEL_NAME,
        queryOptions,
        baseConditions: {
            organization_id
        }
    })
}

async function findByUser({ user_id }) {
    return findAllServices({
        tableName: TABEL_NAME,
        queryOptions,
        baseConditions: {
            user_id
        }
    })
};

async function findMember({ organization_id, user_id }) {
    return findOneServices({
        tableName: TABEL_NAME,
        conditions: {
            organization_id,
            user_id
        }
    })
}

async function countOfMembers({ queryOptions, baseConditions }) {
    return countServices({
        tableName: TABEL_NAME,
        queryOptions,
        baseConditions
    })
};

async function createMember({ data = {}, db }) {
    return createServices({
        tableName: TABEL_NAME,
        data,
        db
    })
};

async function updateMember({ data, organization_id, user_id }) {
    const { role } = data;
    const sqlQuery = `UPDATE ${TABEL_NAME} SET role = $1 WHERE user_id = $2 AND organization_id = $3  RETURNING *`;

    const { rows } = await db.query(sqlQuery, [role, user_id, organization_id])
    return rows[0];
};

async function deleteMember({ user_id, organization_id }) {
    const sqlQuery = `DELETE FROM ${TABEL_NAME} WHERE user_id = $1 AND organization_id = $2 RETURNING *`;
    const { rows } = await db.query(sqlQuery, [user_id, organization_id]);

    return rows[0] || null;
};

export default {
    findAll,
    findByUser,
    findByOrganization,
    findMember,
    countOfMembers,
    createMember,
    updateMember,
    deleteMember
}