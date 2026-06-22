import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("medium");
  const today = new Date().toISOString().split("T")[0];
  const [dueDate, setDueDate] = useState(today);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // axios config
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/tasks",
        config,
      );
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/tasks",
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
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  // delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://taskmanager-86s6.onrender.com/api/tasks/${id}`,
        config,
      );
      fetchTasks();
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  // toggle task
  const toggleTask = async (id) => {
    try {
      await axios.patch(
        `https://taskmanager-86s6.onrender.com/api/tasks/${id}`,
        {},
        config,
      );
      fetchTasks();
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Task Manager</h1>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 outline-none"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-800 p-3 rounded"
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-gray-800 p-3 rounded"
          />
          <button
            onClick={createTask}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-gray-400">Loading tasks...</p>}
          {!loading && tasks.length === 0 && (
            <p className="text-gray-500">No tasks yet. Add your first one 🚀</p>
          )}
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center hover:bg-gray-750 transition"
            >
              <span
                onClick={() => toggleTask(task._id)}
                className={`cursor-pointer ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                <div>
                  <p>{task.title}</p>

                  <div className="text-sm text-gray-400 mt-1">
                    <span className="mr-3">Priority: {task.priority}</span>

                    {task.dueDate && (
                      <span>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
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
