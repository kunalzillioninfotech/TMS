import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { getTasks } from "../services/taskApi";
import KanbanBoard from "../components/KanbanBoard";
import AddTaskModal from "../components/AddTaskModal";
import Layout from "../components/Layout";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout>
        <div className="p-6">
        <Button className="mb-4 bg-black text-white" onClick={() => setOpen(true)}>
            Add Task
        </Button>
        <KanbanBoard tasks={tasks} refreshTasks={fetchTasks} />
        <AddTaskModal open={open} onClose={() => setOpen(false)} refreshTasks={fetchTasks} />
        </div>
    </Layout>
  );
};

export default TasksPage;