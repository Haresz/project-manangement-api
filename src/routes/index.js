import express from "express";
import userController from "../controllers/users.js";
import authController from "../controllers/auth.js";
import organizationController from "../controllers/organization.js";
import memberController from "../controllers/organizationMembers.js";
import projectsController from "../controllers/projects.js";
import taksController from "../controllers/task.js";

import { validationLogin, validationMember, validationOrganization, validationParamsUUID4, validationProject, validationRegister, validationTask } from "../config/validation.js";
import { isAdminOrOwner, isMemberOfOrg, verifyToken } from "../middleware/auth.js";
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

const projectQueryOptions = {
    allowedColumns: ["name", "description", "organization_id", "status", "start_date", "end_date", "created_at", "updated_at"]
};

const taskQueryOptions = {
    allowedColumns: ["title", "description", "project_id", "assignee_id", "reporter_id", "status", "priority", "due_date", "created_at", "updated_at"]
};

// auth
router.get('/users', verifyToken, queryParser(userQueryOptions), userController.getAllUsers);
router.post('/register', validationRegister, userController.createUser);
router.post('/login', validationLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.delete('/logout', verifyToken, authController.logout);

// organization
// next handle if organization delete project, task and coment deleted
router.get('/organizations', verifyToken, queryParser(organizationQueryOptions), organizationController.getAllOrgForMember);
router.get('/organization/:id', verifyToken, validationParamsUUID4(['id']), organizationController.getOrganization);
router.post('/organization/create', verifyToken, validationOrganization, organizationController.createOrganization);
router.patch('/organization/:id', verifyToken, validationParamsUUID4(['id']), organizationController.updateOrganization);
router.delete('/organization/:id', verifyToken, validationParamsUUID4(['id']), organizationController.deleteOrganization);

// members
router.get('/organizations/:organization_id/members', verifyToken, isMemberOfOrg, queryParser(membersQueryOptions), memberController.getMembersOfOrganizations);
router.get('/organizations/:organization_id/members/:user_id', verifyToken, validationParamsUUID4(['organization_id', 'user_id']), isMemberOfOrg, memberController.getDetailMember);
router.post('/organizations/members', verifyToken, isAdminOrOwner, validationMember, memberController.createMember);
router.patch('/organizations/:organization_id/members/:user_id', verifyToken, validationParamsUUID4(['organization_id', 'user_id']), isAdminOrOwner, memberController.updateMember);
router.delete('/organizations/:organization_id/members/:user_id', verifyToken, validationParamsUUID4(['organization_id', 'user_id']), isAdminOrOwner, memberController.deleteMember);

// projects
// next only admin or owner can create, edit, delete
router.get('/organizations/:organization_id/projects', verifyToken, validationParamsUUID4(['organization_id']), queryParser(projectQueryOptions), isMemberOfOrg, projectsController.getProjectsByOrg);
router.get('/projects/:id', verifyToken, validationParamsUUID4(['id']), projectsController.getProject);
router.post('/projects', verifyToken, validationProject, projectsController.createProject);
router.patch('/organizations/:organization_id/projects/:id', verifyToken, validationParamsUUID4(['organization_id', 'id']), projectsController.updateProject);
router.delete('/organizations/:organization_id/projects/:id', verifyToken, validationParamsUUID4(['organization_id', 'id']), projectsController.deleteProject)

// task
// next only admin or owner create, edit, delete
router.get("/projects/:project_id/tasks", verifyToken, validationParamsUUID4(["project_id"]), queryParser(taskQueryOptions), taksController.getTaskByProject)
router.get("/tasks/:id", verifyToken, validationParamsUUID4(["id"]), taksController.getTask)
router.post("/tasks", verifyToken, validationTask, taksController.createTask)
router.patch("/tasks/:id", verifyToken, validationParamsUUID4(["id"]), taksController.updateTask)
router.delete("/tasks/:id", verifyToken, validationParamsUUID4(["id"]), taksController.deleteTask)

export default router