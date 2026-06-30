import { useEffect } from "react";

function TaskDetailsModal({
  task,
  onClose,
  theme,
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  if (!task) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        p-4
      "
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className={`
          w-full max-w-lg rounded-3xl border p-6
          shadow-2xl animate-in fade-in zoom-in-95
          ${
            theme === "dark"
              ? "bg-[#111827] border-gray-800 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }
        `}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {task.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Task details
            </p>
          </div>

          <button
            onClick={onClose}
            className={`
              w-10 h-10 rounded-xl transition
              ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Priority
            </p>

            <span
              className={`
                inline-flex px-3 py-1 rounded-full text-sm capitalize
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

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Category
            </p>

            <span
              className={`
                inline-flex px-3 py-1 rounded-full text-sm capitalize
                ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {task.category}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Due Date
            </p>

            <p className="font-medium">
              {task.dueDate
                ?.split("T")[0] ||
                "No due date"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Status
            </p>

            <span
              className={`
                inline-flex px-3 py-1 rounded-full text-sm
                ${
                  task.completed
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }
              `}
            >
              {task.completed
                ? "Completed"
                : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;