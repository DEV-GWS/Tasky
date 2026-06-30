import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

function DraggableTask({ task, theme }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task._id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        rounded-2xl border p-3 cursor-grab active:cursor-grabbing
        transition-all hover:scale-[1.01]
        ${
          theme === "dark"
            ? "border-gray-700 bg-[#0b0f19]"
            : "border-gray-200 bg-gray-50"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">
          {task.title}
        </h3>

        <span
          className={`
            text-xs px-2 py-1 rounded-full capitalize
            ${
              task.priority === "high"
                ? "bg-red-500/20 text-red-400"
                : task.priority === "medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-blue-500/20 text-blue-400"
            }
          `}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`
            text-xs px-2 py-1 rounded-full capitalize
            ${
              theme === "dark"
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          {task.category}
        </span>

        {task.completed && (
          <span className="text-green-500 text-sm">
            ✓ Done
          </span>
        )}
      </div>
    </div>
  );
}

function DroppableDay({
  day,
  children,
  theme,
}) {
  const { setNodeRef } = useDroppable({
    id: day.date,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-3xl border p-4 space-y-4
        min-h-[300px]
        transition-all
        ${
          theme === "dark"
            ? "bg-[#111827] border-gray-800"
            : "bg-white border-gray-200"
        }
      `}
    >
      {children}
    </div>
  );
}

function WeekDayCard({
  day,
  groupedTasks,
  theme,
  newTaskTitles,
  setNewTaskTitles,
  newTaskPriorities,
  setNewTaskPriorities,
  createQuickTask,
}) {
  const [showAdd, setShowAdd] =
    useState(false);

  return (
    <DroppableDay
      day={day}
      theme={theme}
    >
      <div
        className="flex items-center justify-between border-b border-gray-200/10 pb-3"
      >
        <div>
          <h2 className="font-bold text-lg">
            {day.name}
          </h2>

          <p className="text-sm text-gray-500">
            {day.date}
          </p>
        </div>

        <button
          onClick={() =>
            setShowAdd(!showAdd)
          }
          className="
            w-9 h-9 rounded-xl
            bg-blue-600 hover:bg-blue-500
            text-white text-lg
            transition
          "
        >
          {showAdd ? "×" : "+"}
        </button>
      </div>

      {showAdd && (
        <div
          className={`
            rounded-2xl border p-3 space-y-3
            ${
              theme === "dark"
                ? "border-gray-700 bg-[#0b0f19]"
                : "border-gray-200 bg-gray-50"
            }
          `}
        >
          <input
            type="text"
            placeholder="Task title..."
            value={
              newTaskTitles[day.date] || ""
            }
            onChange={(e) =>
              setNewTaskTitles((prev) => ({
                ...prev,
                [day.date]:
                  e.target.value,
              }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createQuickTask(day.date);

                setShowAdd(false);
              }

              if (e.key === "Escape") {
                setShowAdd(false);
              }
            }}
            autoFocus
            className={`
              w-full px-3 py-2 rounded-xl border outline-none transition
              ${
                theme === "dark"
                  ? "bg-[#111827] border-gray-700 text-white placeholder:text-gray-500"
                  : "bg-white border-gray-200 text-gray-900"
              }
            `}
          />

          <div className="flex gap-2">
            <select
              value={
                newTaskPriorities[
                  day.date
                ] || "medium"
              }
              onChange={(e) =>
                setNewTaskPriorities(
                  (prev) => ({
                    ...prev,
                    [day.date]:
                      e.target.value,
                  }),
                )
              }
              className={`
                flex-1 px-3 py-2 rounded-xl border outline-none
                ${
                  theme === "dark"
                    ? "bg-[#111827] border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }
              `}
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

            <button
              onClick={() => {
                createQuickTask(
                  day.date,
                );

                setShowAdd(false);
              }}
              className="
                px-4 py-2 rounded-xl
                bg-blue-600 hover:bg-blue-500
                text-white transition
              "
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 min-h-[180px]">
        {groupedTasks[day.date]
          ?.length === 0 ? (
          <div
            className={`
              rounded-2xl border border-dashed p-6 text-center text-sm
              ${
                theme === "dark"
                  ? "border-gray-700 text-gray-500"
                  : "border-gray-300 text-gray-400"
              }
            `}
          >
            No tasks
          </div>
        ) : (
          groupedTasks[
            day.date
          ].map((task) => (
            <DraggableTask
              task={task}
              theme={theme}
              key={task._id}
            />
          ))
        )}
      </div>
    </DroppableDay>
  );
}

function Week({ theme }) {
  const [tasks, setTasks] = useState([]);

  const [newTaskTitles, setNewTaskTitles] =
    useState({});

  const [
    newTaskPriorities,
    setNewTaskPriorities,
  ] = useState({});

  const token =
    localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        config,
      );

      setTasks(res.data);
    } catch (error) {
      toast.error(
        "Failed to fetch tasks",
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const today = new Date();

  const startOfWeek = new Date(today);

  startOfWeek.setDate(
    today.getDate() -
      today.getDay() +
      1,
  );

  const weekDays = [...Array(7)].map(
    (_, index) => {
      const date = new Date(
        startOfWeek,
      );

      date.setDate(
        startOfWeek.getDate() +
          index,
      );

      return {
        name: date.toLocaleDateString(
          "en-US",
          {
            weekday: "long",
          },
        ),

        date: date
          .toISOString()
          .split("T")[0],
      };
    },
  );

  const groupedTasks = useMemo(() => {
    const grouped = {};

    weekDays.forEach((day) => {
      grouped[day.date] = [];
    });

    tasks.forEach((task) => {
      const formattedDate =
        task.dueDate?.split("T")[0];

      if (grouped[formattedDate]) {
        grouped[formattedDate].push(
          task,
        );
      }
    });

    return grouped;
  }, [tasks, weekDays]);

  const handleDragEnd = async (
    event,
  ) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id;

    const newDate = over.id;

    try {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...task,
                dueDate: newDate,
              }
            : task,
        ),
      );

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
        {
          dueDate: newDate,
        },
        config,
      );

      toast.success("Task moved");
    } catch (error) {
      toast.error(
        "Failed to move task",
      );

      fetchTasks();
    }
  };

  const createQuickTask = async (
    date,
  ) => {
    const title =
      newTaskTitles[date];

    if (!title?.trim()) {
      return toast.error(
        "Task title required",
      );
    }

    const priority =
      newTaskPriorities[date] ||
      "medium";

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          title,
          priority,
          dueDate: date,
          category: "personal",
        },
        config,
      );

      setTasks((prev) => [
        res.data,
        ...prev,
      ]);

      setNewTaskTitles((prev) => ({
        ...prev,
        [date]: "",
      }));

      setNewTaskPriorities(
        (prev) => ({
          ...prev,
          [date]: "medium",
        }),
      );

      toast.success("Task added");
    } catch (error) {
      toast.error(
        "Failed to create task",
      );
    }
  };

  return (
    <DndContext
      collisionDetection={
        closestCenter
      }
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            📅 Weekly Board
          </h1>

          <p
            className={
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }
          >
            Organize and plan your
            week visually
          </p>
        </div>

        <div
          className="
            grid grid-cols-1 gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {weekDays.map((day) => (
            <WeekDayCard
              key={day.date}
              day={day}
              groupedTasks={
                groupedTasks
              }
              theme={theme}
              newTaskTitles={
                newTaskTitles
              }
              setNewTaskTitles={
                setNewTaskTitles
              }
              newTaskPriorities={
                newTaskPriorities
              }
              setNewTaskPriorities={
                setNewTaskPriorities
              }
              createQuickTask={
                createQuickTask
              }
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export default Week;