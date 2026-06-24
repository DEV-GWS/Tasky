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
  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
        theme === "dark"
          ? "bg-[#111827] border-gray-800 hover:border-gray-700"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
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
              <span
                onClick={() => toggleTask(task)}
                className="cursor-pointer"
              >
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
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
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
    </div>
  );
}

export default TaskCard;
