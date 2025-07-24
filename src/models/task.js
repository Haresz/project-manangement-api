import { countServices, createServices, findAllServices, findOneServices, updateServices } from "../services/dbServices"

const TABLE_NAME = "tasks"

async function findByProject({ project_id, queryOptions }) {
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions,
        baseConditions: {
            project_id
        }
    })
};

async function findTask({ id }) {
    return findOneServices({
        tableName: TABLE_NAME,
        conditions: { id }
    })
};

async function countTask({ project_id, queryOptions }) {
    return countServices({
        tableName: TABLE_NAME,
        queryOptions,
        ...(project_id && {
            baseConditions: {
                project_id
            }
        })
    })
};

async function createTask({ data }) {
    return createServices({
        tableName: TABLE_NAME,
        data
    })
};

async function updateTask({ data, id }) {
    return updateServices({
        tableName: TABLE_NAME,
        data,
        id
    })
};

async function deleteTask({ id }) {
    return deleteTask({
        tableName: TABLE_NAME,
        id
    })
};

export default {
    findByProject,
    findTask,
    countTask,
    createTask,
    updateTask,
    deleteTask
}