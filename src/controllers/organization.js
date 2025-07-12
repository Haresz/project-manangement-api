import { validationResult } from "express-validator";
import organizationModel from "../models/organizations.js";

async function getAllOrganization(req, res) {
    const { pagination } = req.queryOptions;
    const { limit, page } = pagination

    try {
        const users = await organizationModel.findAll(req.queryOptions);
        const count = parseInt(await organizationModel.countOfOrganization(req.queryOptions));

        const paginationResponse = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            itemPerPage: limit,
            currentPage: page,
            nextPage: page < count ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        }

        if (users.length <= 0) {
            return res.status(200).json({
                data: users,
                paginationResponse,
                message: "No users found",
            })
        }

        res.status(200).json({
            data: users,
            paginationResponse,
            message: "succes"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

async function getOrganization(req, res) {
    const { id } = req.params
    try {
        const organization = await organizationModel.findById({ id });

        res.status(200).json({
            data: organization,
            message: "success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
}

async function createOrganization(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const newOrganization = await organizationModel.create(req.body);

        res.status(200).json({
            data: newOrganization,
            message: "success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function updateOrganization(req, res) {
    const { id } = req.params;
    try {
        const organization = await organizationModel.update({ data: req.body, id });

        res.status(200).json({
            data: organization,
            message: "Update Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function deleteOrganization(req, res) {
    const { id } = req.params;
    try {
        const organization = await organizationModel.deleteData({ id });

        res.status(200).json({
            message: "Delete Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export default {
    getAllOrganization,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization
}