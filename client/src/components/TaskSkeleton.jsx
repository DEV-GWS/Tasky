function TaskSkeleton({ theme }) {
  return (
    <div
      className={`
        p-4 rounded-xl border animate-pulse
        ${
          theme === "dark"
            ? "bg-[#111827] border-gray-800"
            : "bg-white border-gray-200"
        }
      `}
    >
      <div
        className={`
          h-5 w-2/3 rounded mb-4
          ${
            theme === "dark"
              ? "bg-gray-700"
              : "bg-gray-300"
          }
        `}
      />

      <div className="flex gap-2">
        <div
          className={`
            h-4 w-20 rounded-full
            ${
              theme === "dark"
                ? "bg-gray-700"
                : "bg-gray-300"
            }
          `}
        />

        <div
          className={`
            h-4 w-28 rounded-full
            ${
              theme === "dark"
                ? "bg-gray-700"
                : "bg-gray-300"
            }
          `}
        />
      </div>
    </div>
  );
}

export default TaskSkeleton;