import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const navigate = useNavigate();

  // STATES
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const today = new Date().toISOString().split("T")[0];

  const [dueDate, setDueDate] = useState(today);

  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const token = localStorage.getItem("token");

  // AXIOS CONFIG
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out");

    navigate("/login");
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        config,
      );

      setTasks(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // CREATE TASK
  const createTask = async () => {
    if (!title.trim()) {
      return toast.error("Task title required");
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          title,
          priority,
          dueDate,
        },
        config,
      );

      setTitle("");
      setPriority("medium");
      setDueDate(today);

      toast.success("Task added");

      fetchTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        config,
      );

      setTasks((prev) => prev.filter((task) => task._id !== id));

      toast.success("Task deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    }
  };

  // TOGGLE TASK
  const toggleTask = async (id) => {
    try {
      // optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task,
        ),
      );

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {},
        config,
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update task");

      fetchTasks();
    }
  };

  // FETCH ON LOAD
  useEffect(() => {
    fetchTasks();
  }, []);

  // FILTER + SEARCH + SORT
  const filteredTasks = tasks

    // FILTERS
    .filter((task) => {
      if (filter === "completed") {
        return task.completed;
      }

      if (filter === "active") {
        return !task.completed;
      }

      if (filter === "high") {
        return task.priority === "high";
      }

      if (filter === "medium") {
        return task.priority === "medium";
      }

      if (filter === "low") {
        return task.priority === "low";
      }

      return true;
    })

    // SEARCH
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))

    // SORT
    .sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sort === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sort === "priority") {
        const order = {
          high: 3,
          medium: 2,
          low: 1,
        };

        return order[b.priority] - order[a.priority];
      }

      if (sort === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return 0;
    });

  // DASHBOARD STATS
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((t) => t.completed).length;

  const activeTasks = totalTasks - completedTasks;

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div
      className={`min-h-screen px-4 py-8 md:px-10 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0b0f19] text-white"
          : "bg-[#f6f7fb] text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-2xl shadow-sm border ${
            theme === "dark"
              ? "bg-[#111827] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Task Manager
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Organize your tasks cleanly and efficiently
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition active:scale-95"
            >
              Logout
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition active:scale-95 ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", value: totalTasks },
            {
              label: "Completed",
              value: completedTasks,
              color: "text-green-500",
            },
            { label: "Active", value: activeTasks, color: "text-yellow-500" },
            {
              label: "Progress",
              value: `${completionRate}%`,
              color: "text-blue-500",
            },
          ].map((item) => (
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

        {/* PROGRESS BAR */}
        <div
          className={`h-2 rounded-full overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div
            className="h-2 bg-blue-500 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        {/* INPUT SECTION */}
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
            className="p-3 rounded-lg bg-gray-100 text-gray-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-3 rounded-lg bg-gray-100 text-gray-900"
          />

          <button
            onClick={createTask}
            disabled={loading}
            className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition active:scale-95"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* FILTERS */}
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

        {/* TASK LIST */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition ${
                theme === "dark"
                  ? "bg-[#111827] border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                onClick={() => toggleTask(task._id)}
                className="cursor-pointer flex-1"
              >
                <p className="text-base font-medium flex items-center gap-2">
                  {task.completed ? "✅" : "⬜"} {task.title}
                </p>

                <div className="text-xs text-gray-500 mt-2 flex gap-4 flex-wrap">
                  <span>Priority: {task.priority}</span>

                  {task.dueDate && (
                    <span>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
