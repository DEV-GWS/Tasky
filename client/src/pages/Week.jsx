import { useMemo } from "react";

function Week({ tasks, theme }) {
  const today = new Date();

  const startOfWeek = new Date(today);

  startOfWeek.setDate(
    today.getDate() - today.getDay() + 1,
  );

  const weekDays = [...Array(7)].map((_, index) => {
    const date = new Date(startOfWeek);

    date.setDate(startOfWeek.getDate() + index);

    return {
      name: date.toLocaleDateString("en-US", {
        weekday: "long",
      }),

      date: date.toISOString().split("T")[0],
    };
  });

  const groupedTasks = useMemo(() => {
    const grouped = {};

    weekDays.forEach((day) => {
      grouped[day.date] = [];
    });

    tasks.forEach((task) => {
      if (grouped[task.dueDate]) {
        grouped[task.dueDate].push(task);
      }
    });

    return grouped;
  }, [tasks, weekDays]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          📅 Weekly Board
        </h1>

        <p
          className={
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }
        >
          Plan your week visually
        </p>
      </div>

      {/* BOARD */}
      <div
        className="
          grid grid-cols-1 gap-4
          md:flex md:gap-4 md:overflow-x-auto md:pb-4
        "
      >
        {weekDays.map((day) => (
          <div
            key={day.date}
            className={`
              w-full md:min-w-[280px]
              rounded-2xl border p-4 space-y-4
              transition
              ${
                theme === "dark"
                  ? "bg-[#111827] border-gray-800"
                  : "bg-white border-gray-200"
              }
            `}
          >
            {/* DAY HEADER */}
            <div className="border-b pb-3 border-gray-200/10">
              <h2 className="font-bold text-lg">
                {day.name}
              </h2>

              <p className="text-sm text-gray-500">
                {day.date}
              </p>
            </div>

            {/* TASKS */}
            <div className="space-y-3">
              {groupedTasks[day.date]?.length === 0 ? (
                <div
                  className={`
                    rounded-xl p-4 text-sm text-center
                    ${
                      theme === "dark"
                        ? "bg-[#0b0f19] text-gray-500"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                >
                  No tasks
                </div>
              ) : (
                groupedTasks[day.date].map((task) => (
                  <div
                    key={task._id}
                    className={`
                      rounded-xl border p-3 transition-all
                      hover:scale-[1.01]
                      ${
                        theme === "dark"
                          ? "border-gray-700 bg-[#0b0f19]"
                          : "border-gray-200 bg-gray-50"
                      }
                    `}
                  >
                    {/* TITLE */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium leading-snug">
                        {task.title}
                      </h3>

                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full whitespace-nowrap
                          ${
                            task.priority === "high"
                              ? "bg-red-500/20 text-red-400"
                              : task.priority ===
                                  "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                          }
                        `}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full
                          ${
                            theme === "dark"
                              ? "bg-gray-800 text-gray-300"
                              : "bg-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {task.category}
                      </span>

                      {task.completed && (
                        <span className="text-green-500 text-sm font-medium">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Week;