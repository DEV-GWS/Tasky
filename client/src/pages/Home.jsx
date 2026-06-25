import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import DashboardCards from "../components/DashboardCards";
import TaskForm from "../components/TaskForm";

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskSkeleton from "../components/TaskSkeleton";

function Home({ theme }) {
  // STATES
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("manual");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [dueDate, setDueDate] = useState(today);

  // get and implant token for requests
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
      toast.success("Task added");
      setTitle("");
      setPriority("medium");
      setDueDate(today);
      fetchTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

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

  const toggleTask = async (task) => {
    try {
      const updatedCompleted = !task.completed;

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id
            ? {
                ...t,
                completed: updatedCompleted,
              }
            : t,
        ),
      );
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        {
          completed: updatedCompleted,
        },
        config,
      );
      toast.success(`Task completed: ${task.title}`);
    } catch (error) {
      toast.error("Failed to update task");
      console.log(error);
      fetchTasks();
    }
  };
  // init Tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // FILTER + SEARCH + SORT
  const filteredTasks = tasks
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
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "manual") {
        return a.order - b.order;
      }
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

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);

    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task._id === active.id);

    const newIndex = tasks.findIndex((task) => task._id === over.id);

    const reordered = arrayMove(tasks, oldIndex, newIndex).map(
      (task, index) => ({
        ...task,
        order: index,
      }),
    );
    console.log(active.id, over.id);
    setTasks(reordered);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/reorder`,
        {
          tasks: reordered.map((task) => ({
            id: task._id,
            order: task.order,
          })),
        },
        config,
      );
    } catch (error) {
      toast.error("Failed to save order");

      fetchTasks();
    } finally {
      setActiveTask(null);
    }
  };

  // DASHBOARD STATS
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate?.split("T")[0] || today);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditPriority("medium");
    setEditDueDate(today);
  };

  const saveEdit = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          title: editTitle,
          priority: editPriority,
          dueDate: editDueDate,
        },
        config,
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                title: editTitle,
                priority: editPriority,
                dueDate: editDueDate,
              }
            : t,
        ),
      );

      cancelEdit();
      toast.success("Task updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  return (
    <div
      className={`min-h-screen px-4 py-8 md:px-10 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0b0f19] text-white"
          : "bg-[#f6f7fb] text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <DashboardCards
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          activeTasks={activeTasks}
          completionRate={completionRate}
          theme={theme}
        />

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

        <TaskForm
          title={title}
          setTitle={setTitle}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          createTask={createTask}
          loading={loading}
          theme={theme}
        />

        <SearchBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          theme={theme}
        />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          theme={theme}
          tasks={tasks}
        />

        {/* TASK LIST */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            {/* TASK LIST */}
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <TaskSkeleton key={i} theme={theme} />
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div
                  className={`rounded-2xl border p-10 text-center transition ${
                    theme === "dark"
                      ? "bg-[#111827] border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="text-5xl mb-4">
                    {search
                      ? "🔍"
                      : filter === "completed"
                        ? "🎉"
                        : filter === "active"
                          ? "🛌"
                          : "📭"}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    {search
                      ? "No matching tasks"
                      : filter === "completed"
                        ? "No completed tasks yet"
                        : filter === "active"
                          ? "No active tasks"
                          : "Your task list is empty"}
                  </h3>

                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  >
                    {search
                      ? "Try a different keyword or filter."
                      : filter === "completed"
                        ? "Complete some tasks to see them here."
                        : filter === "active"
                          ? "Looks like everything is done 😄"
                          : "Start by creating your first task."}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    theme={theme}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                    editingTask={editingTask}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editPriority={editPriority}
                    setEditPriority={setEditPriority}
                    editDueDate={editDueDate}
                    setEditDueDate={setEditDueDate}
                    startEdit={startEdit}
                    cancelEdit={cancelEdit}
                    saveEdit={saveEdit}
                  />
                ))
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeTask ? (
              <div
                className={`
        p-4 rounded-xl border w-[300px]
        shadow-2xl rotate-2 opacity-95
        ${
          theme === "dark"
            ? "bg-[#111827] border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }
      `}
              >
                <p className="font-medium">{activeTask.title}</p>

                <div className="text-xs text-gray-500 mt-2">
                  {activeTask.priority}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default Home;
