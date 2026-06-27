const Task = require("../models/Task");

const getTasks = async (req, res) => {
  const tasks = await Task.find({
    user: req.user.id,
    isDeleted: false,
  }).sort({ order: 1 });

  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, priority, dueDate } = req.body;
  const tasksCount = await Task.countDocuments({
    user: req.user.id,
  });
  const task = await Task.create({
    title,
    priority,
    dueDate,
    user: req.user._id,
    order: tasksCount,
  });

  res.status(201).json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }
  task.isDeleted = true;
  await task.save();
  res.json({
    message: "Task moved to trash",
  });
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
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

const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    for (const task of tasks) {
      await Task.findOneAndUpdate(
        {
          _id: task.id,
          user: req.user.id,
        },
        {
          order: task.order,
        },
      );
    }

    res.json({
      message: "Tasks reordered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reorder tasks",
    });
  }
};

const restoreTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }
  task.isDeleted = false;
  await task.save();
  res.json({
    message: "Task restored",
  });
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  reorderTasks,
  restoreTask,
};
