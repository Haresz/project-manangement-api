import express from "express";
import db from "../config/db.js";
import userController from "../controllers/users.js"

const router = express.Router();

// users

router.get('/users', userController.getAllUsers);

export default router