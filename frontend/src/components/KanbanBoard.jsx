import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { updateTaskStatus } from "../services/taskApi";
import ViewTaskModal from "./ViewTaskModal";

const statuses = ["todo", "in_progress", "done"];

const KanbanBoard = ({ tasks, refreshTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [openView, setOpenView] = useState(false);

  const getTasks = (status) => tasks.filter((t) => t.status === status);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t.id === taskId);
    if (task?.status === newStatus) return;

    try {
      await updateTaskStatus(taskId, newStatus);
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={getTasks(status)}
              onView={(task) => {
                setSelectedTask(task);
                setOpenView(true);
              }}
            />
          ))}
        </div>
      </DndContext>

      {/* ✅ Modal OUTSIDE */}
      <ViewTaskModal
        open={openView}
        onClose={() => setOpenView(false)}
        task={selectedTask}
      />
    </>
  );
};

const Column = ({ status, tasks, onView }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl min-h-[300px]">
      <h2 className="font-bold mb-3 capitalize">{status.replace("_", " ")}</h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onView={onView} />
      ))}
    </div>
  );
};

const TaskCard = ({ task, onView }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const getColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-500 shadow-lg shadow-red-400/70";
      case "medium":
        return "bg-yellow-400 shadow-lg shadow-yellow-300/70";
      case "low":
        return "bg-green-300 shadow-lg shadow-orange-300/70";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2 shadow-sm cursor-grab relative bg-white dark:bg-gray-800 text-black dark:text-white"
    >
      {/* Priority dot */}
      <div
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getColor()}`}
      />

      {/* 👁 Eye Icon */}
      <EyeOutlined
        onClick={(e) => {
          e.stopPropagation(); // 🚨 prevent drag trigger
          onView(task);
        }}
        className="absolute top-2 left-2 text-gray-500 hover:text-black cursor-pointer"
      />

      <h3 className="font-semibold mt-4">{task.title}</h3>
      <p>{task.description}</p>

      <p className="text-sm text-gray-500">Priority: {task.priority}</p>
    </Card>
  );
};

export default KanbanBoard;
