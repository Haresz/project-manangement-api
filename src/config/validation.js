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
        .not().isEmpty()
        .escape(),
    body('owner_id', "Owner must be filled")
        .trim()
        .not().isEmpty()
        .escape()
];

export const validationMember = [
    body('user_id', "user_id must be filled")
        .trim()
        .not().isEmpty()
        .escape().isUUID(4),
    body('organization_id', "organization_id must be filled")
        .trim()
        .not().isEmpty()
        .escape().isUUID(4),
    body('role', "role must be filled")
        .trim()
        .not().isEmpty()
        .escape(),
];

export function validationParamsUUID4(fields = []) {
    return fields.map(f => {
        return param(f, `Invalid ${f}, must be a UUID 4 `).isUUID(4)
    });
}