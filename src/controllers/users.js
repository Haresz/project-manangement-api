import userModel from "../models/users.js";
import { validationResult } from "express-validator";

async function getAllUsers(req, res) {
    try {
        const users = await userModel.findAll();

        res.status(200).json({
            data: users,
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