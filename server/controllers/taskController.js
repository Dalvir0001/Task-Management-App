const Task = require("../models/task");

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const task = await Task.create({
            title,
            description,
            user: req.user.id,
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createTask,
};