const Task = require("../models/Task");

const getTasks = async (req, res) => {
  const tasks = await Task.find({
    user: req.user._id,
  });

  res.json(tasks);
};

const createTask = async (req, res) => {
 const {
    title,
    priority,
    dueDate,
  } = req.body;

  const task = await Task.create({
    title,
    priority,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json(task);
};

const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted",
  });
};

const toggleTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  task.completed = !task.completed;

  await task.save();

  res.json(task);
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
};
