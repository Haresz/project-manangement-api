import { countServices, createServices, deleteServices, findAllServices, findOneServices, updateServices } from "../services/dbServices.js";
const TABLE_NAME = 'projects';

async function findAll(queryOptions) {
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions
    })
};

async function findByOrganization({ organization_id, queryOptions }) {
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions,
        baseConditions: {
            organization_id
        }
    })
};

async function findProject({ id }) {
    return findOneServices({
        tableName: TABLE_NAME,
        conditions: { id }
    })
}

async function countProject({ organization_id, queryOptions }) {
    return countServices({
        tableName: TABLE_NAME,
        queryOptions,
        ...(organization_id && {
            baseConditions: {
                organization_id
            }
        }),
    })
};

async function createProject({ data }) {
    return createServices({
        tableName: TABLE_NAME,
        data
    })
};

async function updateProject({ data, id }) {
    return updateServices({
        tableName: TABLE_NAME,
        data,
        id
    })
};

async function deleteProject({ id }) {
    return deleteServices({
        tableName: TABLE_NAME,
        id
    })
};

export default {
    findAll,
    findByOrganization,
    findProject,
    countProject,
    createProject,
    updateProject,
    deleteProject
}