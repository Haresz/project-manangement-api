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

export function validationParamsUUID4(fields = []) {
    return fields.map(f => {
        return param(f, `Invalid ${f}, must be a UUID 4 `).isUUID(4)
    });
};