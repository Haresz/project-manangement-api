import express from "express";
import userController from "../controllers/users.js";
import authController from "../controllers/auth.js";
import organizationController from "../controllers/organization.js";
import memberController from "../controllers/organizationMembers.js"

import { validationLogin, validationMember, validationOrganization, validationParamsMember, validationRegister } from "../config/validation.js";
import { verifyToken } from "../middleware/auth.js";
import { queryParser } from "../middleware/queryParser.js";

const router = express.Router();

// allow column for sorting and filter
const userQueryOptions = {
    allowedColumns: ["id", "name", "email", "created_at", "updated_at"]
};

const organizationQueryOptions = {
    allowedColumns: ["id", "name", "owner_id"]
};

const membersQueryOptions = {
    allowedColumns: ["role", "organization_id", "user_id", "joined_at"]
};

// auth
router.get('/users', verifyToken, queryParser(userQueryOptions), userController.getAllUsers);
router.post('/register', validationRegister, userController.createUser);
router.post('/login', validationLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.delete('/logout', verifyToken, authController.logout);

// organization
router.get('/organizations', verifyToken, queryParser(organizationQueryOptions), organizationController.getAllOrgForMember);
router.get('/organization/:id', verifyToken, organizationController.getOrganization);
router.post('/organization/create', verifyToken, validationOrganization, organizationController.createOrganization);
router.patch('/organization/:id', verifyToken, organizationController.updateOrganization);
router.delete('/organization/:id', verifyToken, organizationController.deleteOrganization);

// members
router.get('/organizations/:organization_id/members', verifyToken, queryParser(membersQueryOptions), memberController.getMembersOfOrganizations);
router.get('/organizations/:organization_id/members/:user_id', verifyToken, validationParamsMember, memberController.getDetailMember);
router.post('/organizations/members', verifyToken, validationMember, memberController.createMember);
router.patch('/organizations/:organization_id/members/:user_id', verifyToken, validationParamsMember, memberController.updateMember);
router.delete('/organizations/:organization_id/members/:user_id', verifyToken, validationParamsMember, memberController.deleteMember);


export default router