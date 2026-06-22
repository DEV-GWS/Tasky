const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
} = require("../controllers/taskController");

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id", protect, toggleTask);

module.exports = router;