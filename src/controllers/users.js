import userModel from "../models/users.js";
import { validationResult } from "express-validator";

async function getAllUsers(req, res) {
    const { pagination } = req.queryOptions;
    const { limit, page } = pagination

    try {
        const users = await userModel.findAll(req.queryOptions);
        const count = parseInt(await userModel.countOfUsers(req.queryOptions));

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