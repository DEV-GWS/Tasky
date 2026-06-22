const Task = require("../models/Task");


const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

const createTask = async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
  });

  res.status(201).json(task);
};

const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted",
  });
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
};