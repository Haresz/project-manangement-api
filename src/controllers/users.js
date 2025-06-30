import userModel from "../models/users.js";

async function getAllUsers(req, res) {
    try {
        const users = await userModel.findAll();

        res.status(200).json({
            data: users,
            message: "succes"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    getAllUsers
}