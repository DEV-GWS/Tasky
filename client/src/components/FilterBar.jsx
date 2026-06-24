function FilterBar({
  filter,
  setFilter,
  theme,
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {["all", "active", "completed", "high", "medium", "low"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            filter === f
              ? "bg-blue-600 text-white"
              : theme === "dark"
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-200 text-gray-700"
          }`}
        >
          {f.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;