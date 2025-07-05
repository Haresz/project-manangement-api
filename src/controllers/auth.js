import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import usersModel from "../models/users.js";
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

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

        const accesstoken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "15m"
        });

        const refreshToken = jwt.sign(payload, REFRESH_TOKEN, {
            expiresIn: "7d"
        });

        // save refresh token to database
        await usersModel.updateRefreshToken({ userId: user.id, token: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            accesstoken,
            message: "Login successfuly"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to login"
        })
    }
};

async function refreshToken(req, res) {
    let newAccessToken;
    try {
        const tokenFromCookie = req.cookies.refreshToken;
        if (!tokenFromCookie) return res.status(401).json({ message: "No refresh token" })

        const user = await usersModel.findRefreshToken(tokenFromCookie);
        if (!user) return res.status(403).json({ message: "Invalid refresh token" });

        jwt.verify(tokenFromCookie, REFRESH_TOKEN, (err, decode) => {
            if (err || user.id !== decode.id) {
                return res.status(403).json({ message: "Token verification failed" });
            }

            newAccessToken = jwt.sign(
                { id: user.id, anme: user.name, email: user.email },
                JWT_SECRET,
                { expiresIn: "15m" }
            );
        })

        res.status(200).json({
            newAccessToken,
            message: "successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
};

async function logout(req, res) {
    try {
        // from midleware verify token
        const userId = req.user.id;
        if (!userId) return res.status(401).json("Invalid user");

        await usersModel.clearRefreshToken({ userId });

        res.clearCookie('refreshToken')
            .status(200).json({
                message: "Logout successfuly"
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

export default {
    login,
    refreshToken,
    logout
}