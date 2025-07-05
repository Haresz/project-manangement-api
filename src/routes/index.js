import express from "express";
import userController from "../controllers/users.js";
import authController from "../controllers/auth.js";
import { validationLogin, validationRegister } from "../config/validation.js";
import { verifyToken } from "../middleware/auth.js";
import { queryParser } from "../middleware/queryParser.js";

const router = express.Router();

const userQueryOptions = {
    allowedColumns: ["id", "name", "email", "created_at", "updated_at"]
};

// auth
router.get('/users', verifyToken, queryParser(userQueryOptions), userController.getAllUsers);
router.post('/register', validationRegister, userController.createUser);
router.post('/login', validationLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.delete('/logout', verifyToken, authController.logout);

export default router