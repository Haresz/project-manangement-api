import { validationResult } from "express-validator";
import projectsModel from "../models/projects.js";

async function getProjectsByOrg(req, res) {
    const { organization_id } = req.params;
    const { pagination } = req.queryOptions;
    const { limit, page } = pagination;
    try {
        const projects = await projectsModel.findByOrganization({ queryOptions, organization_id });
        const count = parseInt(await projectsModel.countProject({ queryOptions, organization_id }));

        const totalPages = Math.ceil(count / limit);
        const paginationResponse = {
            totalItems: count,
            totalPages,
            itemPerPage: limit,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        };

        if (projects.length <= 0) {
            return res.status(200).json({
                data: projects,
                paginationResponse,
                message: "No projects found"
            })
        };

        res.status(200).json({
            data: projects,
            paginationResponse,
            message: "Succes"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

async function getProject(req, res) {
    const { id } = req.params;
    try {
        const project = await projectsModel.findProject({ id });

        if (!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }

        res.status(200).json({
            data: project,
            message: "Success"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

async function createProject(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const newProject = await projectsModel.createProject({ data: req.body });

        res.status(201).json({
            data: newProject,
            message: "Success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function updateProject(req, res) {
    const { id } = req.params;
    try {
        const project = await projectsModel.updateProject({ data: req.body, id });

        if (!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }

        res.status(201).json({
            data: project,
            message: "Update Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function deleteProject(req, res) {
    const { id } = req.params;
    try {
        const project = await projectsModel.deleteProject({ id });

        if (!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        };

        res.status(201).json({
            data: project,
            message: "Delete Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export default {
    getProjectsByOrg,
    getProject,
    createProject,
    updateProject,
    deleteProject
}