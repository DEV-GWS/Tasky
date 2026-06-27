import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Trash({ theme }) {
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTrash = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/trash`,
        config,
      );

      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to fetch trash");
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const restoreTask = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/restore`,
        {},
        config,
      );

      setTasks((prev) => prev.filter((task) => task._id !== id));

      toast.success("Task restored");
    } catch (error) {
      toast.error("Failed to restore task");
    }
  };

  const permanentlyDeleteTask = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/permanent`,
        config,
      );

      setTasks((prev) => prev.filter((task) => task._id !== id));

      toast.success("Task permanently deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">🗑 Trash</h1>

      {tasks.length === 0 ? (
        <div
          className={`p-10 rounded-2xl text-center border ${
            theme === "dark"
              ? "bg-[#111827] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          Trash is empty 😄
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className={`
              p-4 rounded-2xl border flex items-center justify-between
              ${
                theme === "dark"
                  ? "bg-[#111827] border-gray-800"
                  : "bg-white border-gray-200"
              }
            `}
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>

              <p className="text-sm text-gray-500">{task.category}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => restoreTask(task._id)}
                className="px-4 py-2 rounded-xl bg-green-500 text-white"
              >
                Restore
              </button>

              <button
                onClick={() => permanentlyDeleteTask(task._id)}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                Delete Forever
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Trash;
