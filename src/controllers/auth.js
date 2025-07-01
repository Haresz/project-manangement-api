import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import usersModel from "../models/users.js";
const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }
    try {
        const user = await usersModel.findByCredentials(req.body);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        };

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "24h"
        });

        res.status(200).json({
            token,
            message: "Login successfuly"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to login"
        })
    }
}

export default {
    login
}