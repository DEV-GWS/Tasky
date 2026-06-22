import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [priority, setPriority] = useState("medium");
  const today = new Date().toISOString().split("T")[0];
  const [dueDate, setDueDate] = useState(today);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    setSuccess("Logged out successfully");
    navigate("/login");
  };

  // axios config
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTasks = async () => {
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        config,
      );
      setTasks(res.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
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
      fetchTasks();
      setSuccess("Task created successfully");
      toast.success("Task added");
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      toast.error("Task adding failed!");
    } finally {
      setLoading(false);
    }
  };

  // delete task
  const deleteTask = async (id) => {
    setError("");
    setSuccess("");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        config,
      );
      fetchTasks();
      setSuccess("Task deleted");
      toast.success("Task deleted");
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      toast.error("Task deletion failed");
    }
  };

  // toggle task
  const toggleTask = async (id) => {
    setError("");
    setSuccess("");
    try {
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
      setError(error?.response?.data?.message || "Something went wrong");
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
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

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((t) => t.completed).length;

  const activeTasks = totalTasks - completedTasks;

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Task Manager</h1>

            <p className="text-gray-400">Organize your life properly</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-3 text-gray-300">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {completedTasks}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-yellow-400">{activeTasks}</p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Progress</p>
            <p className="text-2xl font-bold text-blue-400">
              {completionRate}%
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded mb-6">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        {error && (
          <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
        )}

        {success && (
          <div className="bg-green-600 text-white p-2 rounded mb-4">
            {success}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 p-3 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-800 p-3 rounded"
          >
            <option value="newest">Newest</option>

            <option value="oldest">Oldest</option>

            <option value="priority">Priority</option>

            <option value="dueDate">Due Date</option>
          </select>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 p-3 rounded outline-none transition focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-800 p-3 rounded transition hover:bg-gray-700"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-gray-800 p-3 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled={loading}
            onClick={createTask}
            className={`bg-blue-600 px-4 py-2 rounded transition transition-all duration-200 ${
              loading ? "opacity-50" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Loading..." : "Add"}
          </button>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "active", "completed", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded transition ${
                filter === f ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {loading && <p className="text-gray-400">Loading tasks...</p>}
          {!loading && filteredTasks.length === 0 && (
            <div className="text-gray-500 text-center mt-10">
              No tasks yet — time to start building 🔥
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-900 p-5 rounded-xl flex justify-between items-center hover:bg-gray-800 transition duration-200 shadow-lg"
            >
              <span
                onClick={() => toggleTask(task._id)}
                className={`cursor-pointer ${
                  task.completed ? "line-through text-gray-500 opacity-70" : ""
                }`}
              >
                <div className="flex flex-col">
                  <p
                    className={`text-lg ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    <span className="mr-2">{task.completed ? "✅" : "⬜"}</span>
                    {task.title}
                  </p>

                  <div className="text-sm text-gray-400 mt-1 flex gap-3">
                    <span className="mr-3">Priority: {task.priority}</span>

                    {task.dueDate && (
                      <span>
                        Due:
                        <span className="text-white ml-1">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </span>

              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
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
