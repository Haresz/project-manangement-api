import express from "express";
import userController from "../controllers/users.js"
import { validationLogin, validationRegister } from "../config/validation.js";
import authController from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// users
router.get('/users', verifyToken, userController.getAllUsers);
router.post('/register', validationRegister, userController.createUser);
router.post('/login', validationLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.delete('/logout', verifyToken, authController.logout);

export default router