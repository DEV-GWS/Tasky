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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Task Manager</h1>

      <div>
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={createTask}>
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;