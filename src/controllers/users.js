import userModel from "../models/users.js";
import { validationResult } from "express-validator";

async function getAllUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    // sorting
    const allowedColumns = ["name", "email", "created_at", "updated_at"];
    const sortQuery = req.query.sort || "-created_at";

    const sorts = sortQuery.split(',')
        .map(srt => {
            const direction = srt.startsWith("-") ? "DESC" : "ASC";
            const field = srt.startsWith("-") ? srt.slice(1) : srt;

            if (allowedColumns.includes(field)) {
                return { field, direction }
            }
            return null
        })
        .filter(Boolean)

    if (sorts.length === 0) {
        sorts.push({ field: "created_at", direction: "DESC" })
    }

    // filtering
    const filters = [];
    const queryParams = req.query;


    for (const key in queryParams) {
        // matching this formats
        const match = key.match(/(\w+)\[(\w+)\]/);
        if (match) {
            const field = match[1];
            const operator = match[2];
            const value = queryParams[key];

            if (allowedColumns.includes(field)) {
                filters.push({ field, operator, value })
            }

        }
    }

    try {
        const users = await userModel.findAll({ limit, offset, sorts, filters });
        const count = parseInt(await userModel.countOfUsers());

        const pagination = {
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
                pagination,
                message: "No users found",
            })
        }

        res.status(200).json({
            data: users,
            pagination,
            message: "succes"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

async function createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newUser = await userModel.create(req.body);


        if (!newUser) {
            return res.status(409).json({ message: "Email already exist" })
        }

        res.status(200).json({
            data: newUser,
            message: "succes"
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
};

export default {
    getAllUsers,
    createUser
}