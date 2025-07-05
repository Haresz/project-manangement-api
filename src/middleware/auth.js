import jwt from "jsonwebtoken";
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