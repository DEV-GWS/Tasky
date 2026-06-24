function TaskForm({
  title,
  setTitle,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  createTask,
  loading,
  theme,
}) {
  return (
    <div
      className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-3 ${
        theme === "dark"
          ? "bg-[#111827] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <input
        type="text"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`flex-1 p-3 rounded-lg outline-none transition ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
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
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={`p-3 rounded-lg outline-none transition ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      />

      <button
        onClick={createTask}
        disabled={loading}
        className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition active:scale-95"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}

export default TaskForm;