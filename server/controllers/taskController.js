const Task = require("../models/task");

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
        });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

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
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Task deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};