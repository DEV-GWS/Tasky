import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  // create task
  const createTask = async () => {
    if (!title.trim()) return;

    await axios.post("http://localhost:5000/api/tasks", {
      title,
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);

    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.patch(`http://localhost:5000/api/tasks/${id}`);

    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);
return (
  <div className="min-h-screen bg-gray-900 text-white p-8">

    <div className="max-w-xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        Task Manager
      </h1>

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
                task.completed
                  ? "line-through text-gray-500"
                  : ""
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

export default App;
