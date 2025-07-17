import jwt from "jsonwebtoken";
import organizationMembers from "../models/organizationMembers.js";
const JWT_SECRET = process.env.JWT_SECRET

export function verifyToken(req, res, next) {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" })
        }

        req.user = decode;
        next();
    });
};

export async function isAdminOrOwner(req, res, next) {
    const { organization_id } = req.params;
    const { id: user_id } = req.user;

    try {
        const user = await organizationMembers.findMember({ organization_id, user_id });

        if (user.role != 'owner' || user.role != 'admin') {
            return res.status(403).json({
                message: 'akses denied, only admin.'
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
};

export async function isMemberOfOrg(req, res, next) {
    const { organization_id } = req.params;
    const { id: user_id } = req.user;

    try {
        const user = await organizationMembers.findMember({ organization_id, user_id });

        if (!user) {
            return res.status(403).json({
                message: 'akses denied, only organization member.'
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
};