const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  reorderTasks,
  restoreTask,
  getTrashTasks,
  permanentlyDeleteTask,
} = require("../controllers/taskController");

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id", protect, updateTask);
router.put("/reorder", protect, reorderTasks);

router.get("/trash", protect, getTrashTasks);
router.patch("/:id/restore", protect, restoreTask);
router.delete("/:id/permanent", protect, permanentlyDeleteTask);

module.exports = router;
