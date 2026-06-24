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



const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({message: "Task not found"});
    }
    // check authorization
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    task.title = req.body.title ?? task.title;
    task.priority = req.body.priority ?? task.priority;
    task.dueDate = req.body.dueDate ?? task.dueDate;

    // optional toggle
    if (req.body.completed !== undefined) {
      task.completed = req.body.completed;
    }
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};
