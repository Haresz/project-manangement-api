import express from "express";
import userController from "../controllers/users.js";
import authController from "../controllers/auth.js";
import organizationController from "../controllers/organization.js";

import { validationLogin, validationOrganization, validationRegister } from "../config/validation.js";
import { verifyToken } from "../middleware/auth.js";
import { queryParser } from "../middleware/queryParser.js";

const router = express.Router();

// allow column for sorting and filter
const userQueryOptions = {
    allowedColumns: ["id", "name", "email", "created_at", "updated_at"]
};

const organizationQueryOptions = {
    allowedColumns: ["id", "name", "owner_id"]
}

// auth
router.get('/users', verifyToken, queryParser(userQueryOptions), userController.getAllUsers);
router.post('/register', validationRegister, userController.createUser);
router.post('/login', validationLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.delete('/logout', verifyToken, authController.logout);

// organization
router.get('/organizations', verifyToken, queryParser(organizationQueryOptions), organizationController.getAllOrganization);
router.get('/organization/:id', verifyToken, organizationController.getOrganization)
router.post('/organization/create', verifyToken, validationOrganization, organizationController.createOrganization);
router.patch('/organization/:id', verifyToken, organizationController.updateOrganization);
router.delete('/organization/:id', verifyToken, organizationController.deleteOrganization)


export default router