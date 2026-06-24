function DashboardCards({
  totalTasks,
  completedTasks,
  activeTasks,
  completionRate,
  theme,
}) {
  const cards = [
    {
      label: "Total",
      value: totalTasks,
    },
    {
      label: "Completed",
      value: completedTasks,
      color: "text-green-500",
    },
    {
      label: "Active",
      value: activeTasks,
      color: "text-yellow-500",
    },
    {
      label: "Progress",
      value: `${completionRate}%`,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item) => (
        <div
          key={item.label}
          className={`p-5 rounded-xl border shadow-sm ${
            theme === "dark"
              ? "bg-[#111827] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className={`text-2xl font-semibold mt-1 ${item.color || ""}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
