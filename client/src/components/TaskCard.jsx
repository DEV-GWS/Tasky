import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useEffect } from "react";

function TaskCard({
  task,
  theme,
  editingTask,
  editTitle,
  editPriority,
  editDueDate,
  setEditTitle,
  setEditPriority,
  setEditDueDate,
  toggleTask,
  startEdit,
  saveEdit,
  cancelEdit,
  deleteTask,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);

  const isOverdue = task.dueDate && taskDate < today && !task.completed;

  const isToday =
    task.dueDate && taskDate.getTime() === today.getTime() && !task.completed;

  const isUpcoming = task.dueDate && taskDate > today && !task.completed;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && editingTask === task._id) {
        cancelEdit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingTask, task._id, cancelEdit]);
  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      whileDrag={{
        scale: 1.03,
      }}
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm  touch-none
    transition-shadow ${
      theme === "dark"
        ? "bg-[#111827] border-gray-800 hover:border-gray-700"
        : "bg-white border-gray-200 hover:border-gray-300"
    } ${isDragging ? "z-50 shadow-2xl rotate-1 opacity-90" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.25,
      }}
    >
      {/* LEFT */}
      <div className="flex-1">
        {editingTask === task._id ? (
          <div className="space-y-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title..."
              className={`w-full p-3 rounded-lg outline-none transition ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            />

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className={`p-3 rounded-lg outline-none transition ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className={`p-3 rounded-lg outline-none transition ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              />
            </div>
          </div>
        ) : (
          <div>
            <p
              className={`text-base md:text-lg font-medium flex items-center gap-2 transition ${
                task.completed ? "line-through opacity-60 text-gray-500" : ""
              }`}
            >
              <span onClick={() => toggleTask(task)} className="cursor-pointer">
                {task.completed ? "✅" : "⬜"}
              </span>
              {task.title}
            </p>

            <div className="text-xs md:text-sm text-gray-500 mt-3 flex flex-wrap gap-4">
              <span className="capitalize">
                Priority:
                <span
                  className={`ml-1 font-medium ${
                    task.priority === "high"
                      ? "text-red-500"
                      : task.priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {task.priority}
                </span>
              </span>
              {task.dueDate && (
                <span
                  className={`
    px-2 py-1 rounded-full text-xs font-medium
    ${
      task.completed
        ? theme === "dark"
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-200 text-gray-600"
        : isOverdue
          ? "bg-red-100 text-red-600"
          : isToday
            ? "bg-yellow-100 text-yellow-700"
            : isUpcoming
              ? "bg-blue-100 text-blue-700"
              : ""
    }
  `}
                >
                  {task.completed
                    ? "Completed"
                    : isOverdue
                      ? "Overdue"
                      : isToday
                        ? "Today"
                        : "Upcoming"}
                  {" • "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 self-start">
        {editingTask === task._id ? (
          <>
            <button
              onClick={() => saveEdit(task._id)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Save
            </button>

            <button
              onClick={cancelEdit}
              className={`px-4 py-2 rounded-lg transition ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              {...attributes}
              {...listeners}
              className={`p-2 rounded-lg cursor-grab active:cursor-grabbing transition ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-200 text-gray-500"
              }`}
            >
              <HiOutlineBars3 size={18} />
            </button>
            <button
              onClick={() => startEdit(task)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTask(task._id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default TaskCard;
