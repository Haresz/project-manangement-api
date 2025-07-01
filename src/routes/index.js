import express from "express";
import userController from "../controllers/users.js"
import { validationLogin, validationRegister } from "../config/validation.js";
import authController from "../controllers/auth.js";

const router = express.Router();

// users

router.get('/users', userController.getAllUsers);
router.post('/register', validationRegister, userController.createUser);
router.post('/login', validationLogin, authController.login)

export default router