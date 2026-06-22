import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  // logout
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

  // fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", config);

      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // create task
  const createTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/tasks", { title }, config);

      setTitle("");

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // toggle task
  const toggleTask = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, {}, config);

      fetchTasks();
    } catch (error) {
      console.error(error);
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
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
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

          <button
            onClick={createTask}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <span
                onClick={() => toggleTask(task._id)}
                className={`cursor-pointer ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
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
