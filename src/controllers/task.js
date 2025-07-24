import { validationResult } from "express-validator";
import taskModel from "../models/task";
import projects from "./projects";

async function getTaskByProject(req, res) {
    const { project_id } = req.params;
    const { limit, page } = req.queryOptions.pagination;

    try {
        const tasks = await taskModel.findByProject({ project_id, queryOptions: req.queryOptions });
        const count = parseInt(await taskModel.countTask({ queryOptions: req.queryOptions, project_id }));

        const totalPages = Math.ceil(count / limit);
        const paginationResponse = {
            totaItems: count,
            totalPages,
            itemPerPage: limit,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        };

        if (tasks.length <= 0) {
            return res.status(200).json({
                data: tasks,
                paginationResponse,
                message: "No tasks found"
            })
        }

        res.status(200).json({
            data: tasks,
            paginationResponse,
            message: "succes"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

async function getTask(req, res) {
    const { id } = req.params;
    try {
        const task = await taskModel.findTask({ id });

        if (!task) {
            return res.status(404).json({
                message: "Task Not Found"
            })
        }

        res.status(200).json({
            data: task,
            message: "Success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

async function createTask(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const newTask = await taskModel.createTask({ data: req.body });

        res.status(201).json({
            data: newTask,
            message: "Success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

async function updateTask(req, res) {
    const { id } = req.params;
    try {
        const task = await taskModel.updateTask({ data: req.body, id });

        if (!task) {
            return res.status(404).json({
                message: "Task Not Found"
            })
        }

        res.status(201).json({
            data: task,
            message: "Update Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function deleteTask(req, res) {
    const { id } = req.params;
    try {
        const task = await taskModel.deleteTask({ id });

        if (!task) {
            return res.status(404).json({
                message: "Task Not Found"
            })
        };

        res.status(201).json({
            data: task,
            message: "Delete Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export default {
    getTaskByProject,
    getTask,
    createTask,
    updateTask,
    deleteTask
}