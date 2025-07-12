import { countServices, createServices, deleteServices, findALLServices, findOneServices, updateServices } from "../services/dbServices.js"
const TABEL_NAME = "organization_members"

async function findAll(queryOptions) {
    return findALLServices({
        tableName: TABEL_NAME,
        queryOptions
    })
};

async function findByOrganization({ organization_id }) {
    return findOneServices({
        tableName: TABEL_NAME,
        conditions: { organization_id }
    })
}

async function findByUser({ user_id }) {
    return findOneServices({
        tableName: TABEL_NAME,
        conditions: { user_id }
    })
};

async function countOfMembers(queryOptions) {
    return countServices({
        tableName: TABEL_NAME,
        queryOptions
    })
};

async function createMember(data = {}) {
    return createServices({
        tableName: TABEL_NAME,
        data
    })
};

async function updateMember({ data, id }) {
    return updateServices({
        tableName: TABEL_NAME,
        data,
        id
    })
};

async function deleteMember(params) {
    return deleteServices({ tableName: TABEL_NAME, id })
};

export default {
    findAll,
    findByUser,
    findByOrganization,
    countOfMembers,
    createMember,
    updateMember,
    deleteMember
}