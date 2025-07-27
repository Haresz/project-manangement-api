import { countServices, findAllServices, findOneServices } from "../services/dbServices"

const TABLE_NAME = "coments"

async function findByTask({ task_id, queryOptions }) {
    return findAllServices({
        tableName: TABLE_NAME,
        queryOptions,
        baseConditions: {
            task_id
        }
    })
}

async function findComment({ id }) {
    return findOneServices({
        tableName: TABLE_NAME,
        conditions: { id }
    })
}

async function countComments({ task_id, queryOptions }) {
    return countServices({
        tableName: TABLE_NAME,
        queryOptions,
        ...(task_id && {
            baseConditions: {
                task_id
            }
        })
    })
};

async function createComment({ data }) {
    return createServices({
        tableName: TABLE_NAME,
        data
    })
};

async function updateComment({ data, id }) {
    return updateServices({
        tableName: TABLE_NAME,
        data,
        id
    })
};

async function deleteComment({ id }) {
    return deleteTask({
        tableName: TABLE_NAME,
        id
    })
};

export default {
    findByTask,
    findComment,
    countComments,
    createComment,
    deleteComment,
    updateComment
}