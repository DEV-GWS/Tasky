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
        config
      );

      setTasks(res.data);

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch tasks"
      );

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
        config
      );

      setTitle("");
      setPriority("medium");
      setDueDate(today);

      toast.success("Task added");

      fetchTasks();

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create task"
      );

    } finally {
      setLoading(false);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        config
      );

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );

      toast.success("Task deleted");

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete task"
      );
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
            : task
        )
      );

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {},
        config
      );

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
          "Failed to update task"
      );

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
    .filter((task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    // SORT
    .sort((a, b) => {

      if (sort === "newest") {
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      }

      if (sort === "oldest") {
        return (
          new Date(a.createdAt) -
          new Date(b.createdAt)
        );
      }

      if (sort === "priority") {

        const order = {
          high: 3,
          medium: 2,
          low: 1,
        };

        return (
          order[b.priority] -
          order[a.priority]
        );
      }

      if (sort === "dueDate") {
        return (
          new Date(a.dueDate) -
          new Date(b.dueDate)
        );
      }

      return 0;
    });

  // DASHBOARD STATS
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.completed
  ).length;

  const activeTasks =
    totalTasks - completedTasks;

  const completionRate = totalTasks
    ? Math.round(
        (completedTasks / totalTasks) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6 md:px-10">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Task Manager
            </h1>

            <p className="text-gray-400">
              Organize your life properly
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded-lg
            hover:bg-red-700 transition-all duration-200
            active:scale-95"
          >
            Logout
          </button>

        </div>

        {/* DASHBOARD */}
        <h2 className="text-xl font-semibold mb-3 text-gray-300">
          Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">
              Total
            </p>

            <p className="text-2xl font-bold">
              {totalTasks}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">
              Completed
            </p>

            <p className="text-2xl font-bold text-green-400">
              {completedTasks}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">
              Active
            </p>

            <p className="text-2xl font-bold text-yellow-400">
              {activeTasks}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">
              Progress
            </p>

            <p className="text-2xl font-bold text-blue-400">
              {completionRate}%
            </p>
          </div>

        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-800 h-2 rounded mb-6">

          <div
            className="bg-blue-500 h-2 rounded transition-all duration-300"
            style={{
              width: `${completionRate}%`,
            }}
          ></div>

        </div>

        {/* SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-gray-800 p-3 rounded-lg
            outline-none focus:ring-2
            focus:ring-blue-500"
          />

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="bg-gray-800 p-3 rounded-lg
            outline-none"
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="priority">
              Priority
            </option>

            <option value="dueDate">
              Due Date
            </option>

          </select>

        </div>

        {/* CREATE TASK */}
        <div className="bg-gray-900 p-4 rounded-xl flex flex-col md:flex-row gap-3 mb-6">

          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full bg-gray-800 p-3 rounded-lg
            outline-none focus:ring-2
            focus:ring-blue-500"
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            className="bg-gray-800 p-3 rounded-lg"
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
            className="bg-gray-800 p-3 rounded-lg"
          />

          <button
            disabled={loading}
            onClick={createTask}
            className="bg-blue-600 px-5 py-3 rounded-lg
            hover:bg-blue-700 transition-all duration-200
            active:scale-95 w-full md:w-auto"
          >
            {loading ? "Loading..." : "Add"}
          </button>

        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">

          {[
            "all",
            "active",
            "completed",
            "high",
            "medium",
            "low",
          ].map((f) => (

            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
              px-4 py-2 rounded-lg whitespace-nowrap
              text-sm font-medium transition-all duration-200
              active:scale-95

              ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }
              `}
            >
              {f.toUpperCase()}
            </button>

          ))}

        </div>

        {/* TASKS */}
        <div className="space-y-3">

          {loading && (
            <p className="text-gray-400">
              Loading tasks...
            </p>
          )}

          {!loading &&
            filteredTasks.length === 0 && (
              <div className="text-gray-500 text-center mt-10">
                No tasks found 🔥
              </div>
            )}

          {filteredTasks.map((task) => (

            <div
              key={task._id}
              className="bg-gray-900 p-4 rounded-xl
              flex flex-col md:flex-row md:items-center
              md:justify-between gap-4
              hover:bg-gray-800 transition duration-200
              shadow-lg"
            >

              <div
                onClick={() =>
                  toggleTask(task._id)
                }
                className="cursor-pointer flex-1"
              >

                <p
                  className={`text-lg break-words ${
                    task.completed
                      ? "line-through text-gray-500 opacity-70"
                      : ""
                  }`}
                >

                  <span className="mr-2">
                    {task.completed
                      ? "✅"
                      : "⬜"}
                  </span>

                  {task.title}

                </p>

                <div className="text-sm text-gray-400 mt-2 flex flex-wrap gap-3">

                  <span>
                    Priority:
                    <span className="text-white ml-1 capitalize">
                      {task.priority}
                    </span>
                  </span>

                  {task.dueDate && (
                    <span>
                      Due:
                      <span className="text-white ml-1">
                        {new Date(
                          task.dueDate
                        ).toLocaleDateString()}
                      </span>
                    </span>
                  )}

                </div>

              </div>

              <button
                onClick={() =>
                  deleteTask(task._id)
                }
                className="bg-red-600 px-4 py-2 rounded-lg
                hover:bg-red-700 transition-all duration-200
                active:scale-95 w-full md:w-auto"
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