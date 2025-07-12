import { validationResult } from "express-validator";
import organizationMembersModels from "../models/organizationMembers";

async function getMembersOfOrganizations(req, res) {
    const { organization_id } = req.params;
    const { pagination } = req.queryOptions;
    const { limit, page } = pagination;

    try {
        const members = await organizationMembersModels.findByOrganization({ organization_id, queryOptions: req.queryOptions });
        const count = parseInt(await organizationMembersModels.countOfMembers({
            queryOptions: req.queryOptions, baseConditions: {
                organization_id
            }
        }));

        const paginationResponse = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            itemPerPage: limit,
            currentPage: page,
            nextPage: page < count ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        };

        if (members.length <= 0) {
            return res.status(200).json({
                data: members,
                paginationResponse,
                message: "No Members Found"
            })
        };

        res.status(200).json({
            data: members,
            paginationResponse,
            message: "succes"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function getDetailMember(req, res) {
    const { organization_id, user_id } = req.params;
    try {
        const member = await organizationMembersModels.findMember({ organization_id, user_id });

        if (!member) {
            return res.status(404).json({
                message: `Member Not Found`
            })
        }

        res.status(200).json({
            data: member,
            message: "success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
};

async function createMember(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const newMember = await organizationMembersModels.createMember({ data: req.body });

        if (!newMember) {
            res.status(409).json({ message: "User already exist" })
        }

        res.status(200).json({
            data: newMember,
            message: "seccess"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function updateMember(req, res) {
    const { organization_id, user_id } = req.params;
    try {
        const member = await organizationMembersModels.updateMember({ data: req.body, organization_id, user_id });

        if (!member) {
            return res.status(404).json({
                message: `Member Not Found`
            })
        }

        res.status(200).json({
            data: member,
            message: "Update Successfuly"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
};

async function deleteMember(req, res) {
    const { organization_id, user_id } = req.params;
    try {
        const member = await organizationMembersModels.deleteMember({ organization_id, user_id });

        if (!member) {
            return res.status(404).json({
                message: `Member Not Found`
            })
        };

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export default {
    getMembersOfOrganizations,
    getDetailMember,
    createMember,
    updateMember,
    deleteMember
}
