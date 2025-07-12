import { validationResult } from "express-validator";
import organizationModel from "../models/organizations.js";
import { createOrganizationAndAddOwner } from "../services/organizationServices.js";

async function getAllOrgForMember(req, res) {
    const { id: user_id } = req.user;
    const { pagination } = req.queryOptions;
    const { limit, page } = pagination;


    try {
        const users = await organizationModel.findAllForMember({ queryOptions: req.queryOptions, user_id });
        const count = parseInt(await organizationModel.countForMember({ queryOptions: req.queryOptions, user_id }));

        const totalPages = Math.ceil(count / limit);
        const paginationResponse = {
            totalItems: count,
            totalPages,
            itemPerPage: limit,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        }

        if (users.length <= 0) {
            return res.status(200).json({
                data: users,
                paginationResponse,
                message: "No organizations found",
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

        if (!organization) {
            return res.status(404).json({
                message: `Organization Not Found`
            })
        }

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
        const newOrganization = await createOrganizationAndAddOwner({ data: req.body, ownerId: req.user.id });

        res.status(201).json({
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

        if (!organization) {
            return res.status(404).json({
                message: `Organization Not Found`
            })
        }

        res.status(201).json({
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

        if (!organization) {
            return res.status(404).json({
                message: `Organization Not Found`
            })
        }

        res.status(201).json({
            data: organization,
            message: "Delete Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export default {
    getAllOrgForMember,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization
}