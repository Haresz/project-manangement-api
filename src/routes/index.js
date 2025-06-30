import express from "express";
import userController from "../controllers/users.js"
import { body } from "express-validator";

const router = express.Router();

// users

router.get('/users', userController.getAllUsers);

router.post('/register', [
    body('name', "Name must be filled")
        .trim()
        .not().isEmpty()
        .escape(),
    body('email')
        .trim()
        .not().isEmpty().withMessage("Email must be filled")
        .isEmail().normalizeEmail().withMessage("Invalid email"),
    body('password', "Password at least 6 character")
        .isLength({ min: 6 }),
    body('avatar_url')
        .trim()
        .optional({ checkFalsy: true })
        .isURL()
        .escape()
], userController.createUser);

export default router