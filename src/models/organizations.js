import { countServices, createServices, deleteServices, findAllServices, findOneServices, updateServices } from "../services/dbServices.js";
const TABLE_NAME = "organizations"

async function findAll(queryOptions) {
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions
    })
};

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
    findById,
    findByOwner,
    countOfOrganization,
    create,
    update,
    deleteData
}