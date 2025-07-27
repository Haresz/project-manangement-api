import { validationResult } from "express-validator";
import commentModel from "../models/comments";

async function getCommentsByTask(req, res) {
    const { task_id } = req.params;
    const { limit, page } = req.queryOptions.pagination;

    try {
        const comments = await commentModel.findByTask({ task_id, queryOptions: req.queryOptions });
        const count = parseInt(await commentModel.countComments({ queryOptions: req.queryOptions, task_id }));

        const totalPages = Math.ceil(count / limit);
        const paginationResponse = {
            totaItems: count,
            totalPages,
            itemPerPage: limit,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        };

        if (comments.length <= 0) {
            return res.status(200).json({
                data: comments,
                paginationResponse,
                message: "No comments found"
            })
        }

        res.status(200).json({
            data: comments,
            paginationResponse,
            message: "succes"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

async function getComment(req, res) {
    const { id } = req.params;
    try {
        const comment = await commentModel.findComment({ id });

        if (!comment) {
            return res.status(404).json({
                message: "Comment Not Found"
            })
        }

        res.status(200).json({
            data: comment,
            message: "Success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

async function createComment(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const newComment = await commentModel.createComment({ data: req.body });

        res.status(201).json({
            data: newComment,
            message: "Success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

async function updateComment(req, res) {
    const { id } = req.params;
    try {
        const comment = await commentModel.updateComment({ data: req.body, id });

        if (!comment) {
            return res.status(404).json({
                message: "comment Not Found"
            })
        }

        res.status(201).json({
            data: comment,
            message: "Update Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" })
    }
};

async function deleteComment(req, res) {
    const { id } = req.params;
    try {
        const comment = await commentModel.deleteComment({ id });

        if (!comment) {
            return res.status(404).json({
                message: "Comment Not Found"
            })
        };

        res.status(201).json({
            data: comment,
            message: "Delete Successfuly"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export default {
    getCommentsByTask,
    getComment,
    createComment,
    updateComment,
    deleteComment
}