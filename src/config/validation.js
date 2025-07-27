import { body, param } from "express-validator";

export const validationRegister = [
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
];

export const validationLogin = [
    body('email')
        .trim()
        .not().isEmpty().withMessage("Email must be filled")
        .isEmail().normalizeEmail().withMessage("Invalid email"),
    body('password', "Password must be filled")
        .trim()
        .not().isEmpty()
        .escape(),
];

export const validationOrganization = [
    body('name', "Name must be filled")
        .trim()
        .not().isEmpty(),
    body('owner_id', "Owner must be filled")
        .trim()
        .not().isEmpty()
];

export const validationMember = [
    body('user_id', "user_id must be filled")
        .trim()
        .not().isEmpty()
        .isUUID(4),
    body('organization_id', "organization_id must be filled")
        .trim()
        .not().isEmpty()
        .isUUID(4),
    body('role', "role must be filled")
        .trim()
        .not().isEmpty()
        .escape(),
];

// Daftar status yang diizinkan untuk proyek
const ALLOWED_STATUSES = ['PENDING', 'ON_PROGRESS', 'COMPLETED', 'CANCELLED'];
const ALLOWED_PRIORITY = ['0', '1', '2', '3', '4'];

export const validationProject = [
    // 1. Validasi Name & Description
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required."),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required."),

    // 2. Validasi Organization ID
    body("organization_id")
        .trim()
        .notEmpty().withMessage("Organization ID is required.")
        .isUUID(4).withMessage("Organization ID must be a valid UUIDv4."),

    // 3. Validasi Status dengan isIn()
    body("status")
        .trim()
        .notEmpty().withMessage("Status is required.")
        .isIn(ALLOWED_STATUSES).withMessage(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}`),

    // 4. Validasi Tanggal yang lebih baik
    body("start_date")
        .isISO8601().withMessage("Start date must be a valid ISO8601 date (YYYY-MM-DD).")
        .toDate(), // Konversi ke objek Date
    body("end_date")
        .isISO8601().withMessage("End date must be a valid ISO8601 date (YYYY-MM-DD).")
        .toDate() // Konversi ke objek Date
        .custom((endDate, { req }) => {
            // Pastikan end_date tidak lebih awal dari start_date
            if (endDate < req.body.start_date) {
                throw new Error('End date cannot be before start date.');
            }
            return true;
        }),
];

export const validationTask = [
    body("title")
        .trim().notEmpty().withMessage("Title is required."),
    body("description")
        .trim().notEmpty().withMessage("Description is required."),
    body("project_id")
        .trim().notEmpty().withMessage("Project ID is required.")
        .isUUID(4).withMessage("Project ID must be a valid UUID4"),
    body("assignee_id")
        .trim().notEmpty().withMessage("Assignee ID is required.")
        .isUUID(4).withMessage("Assignee ID must be a valid UUID4"),
    body("reporter_id")
        .trim().notEmpty().withMessage("Reporter ID is required.")
        .isUUID(4).withMessage("Reporter ID must be a valid UUID4"),
    body("status")
        .trim().notEmpty().withMessage("Status ID is required.")
        .isIn(ALLOWED_STATUSES).withMessage(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`),
    body("priorty")
        .trim().notEmpty().withMessage("Priority is required.")
        .isIn(ALLOWED_PRIORITY).withMessage(`Status must be one of: ${ALLOWED_PRIORITY.join(", ")}`),
    body("due_date")
        .isISO8601().withMessage("Start date must be valid ISO8601 date (YYYY-MM-DD).")
        .toDate()
];

export const validationComment = [
    body("content")
        .trim().notEmpty().withMessage("Content is required"),
    body("user_id")
        .trim().notEmpty().withMessage("User ID is required")
        .isUUID(4).withMessage("User ID must be a valid UUID4"),
    body("task_id")
        .trim().notEmpty().withMessage("Task ID is required")
        .isUUID(4).withMessage("Task ID must be valid UUID4")
]

export function validationParamsUUID4(fields = []) {
    return fields.map(f => {
        return param(f, `Invalid ${f}, must be a UUID 4 `).isUUID(4)
    });
};