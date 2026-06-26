function FilterBar({ filter, setFilter, theme, tasks }) {
  const filters = [
    {
      key: "all",
      label: "ALL",
      count: tasks.length,
    },
    {
      key: "active",
      label: "ACTIVE",
      count: tasks.filter((t) => !t.completed).length,
    },
    {
      key: "completed",
      label: "COMPLETED",
      count: tasks.filter((t) => t.completed).length,
    },
    {
      key: "high",
      label: "HIGH",
      count: tasks.filter((t) => t.priority === "high").length,
    },
    {
      key: "medium",
      label: "MEDIUM",
      count: tasks.filter((t) => t.priority === "medium").length,
    },
    {
      key: "low",
      label: "LOW",
      count: tasks.filter((t) => t.priority === "low").length,
    },
    // CATEGORIES
    {
      key: "work",
      label: "💼 WORK",
      count: tasks.filter((t) => t.category === "work").length,
    },
    {
      key: "study",
      label: "📚 STUDY",
      count: tasks.filter((t) => t.category === "study").length,
    },
    {
      key: "personal",
      label: "🏠 PERSONAL",
      count: tasks.filter((t) => t.category === "personal").length,
    },
    {
      key: "project",
      label: "🚀 PROJECT",
      count: tasks.filter((t) => t.category === "project").length,
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
            transition-all duration-200 active:scale-95
            ${
              filter === f.key
                ? "bg-blue-600 text-white shadow"
                : theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
        >
          {f.label}
          <span
            className={`
              ml-2 px-2 py-0.5 rounded-full text-xs
              ${
                filter === f.key
                  ? "bg-white/20 text-white"
                  : theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-white text-gray-600"
              }
            `}
          >
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
