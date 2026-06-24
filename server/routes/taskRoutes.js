const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id", protect, updateTask);

module.exports = router;