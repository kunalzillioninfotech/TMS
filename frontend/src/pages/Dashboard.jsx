import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import { getTasks } from "../services/taskApi";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { LineChart, Line, CartesianGrid } from "recharts";
import { Table, Tag, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
  
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  const chartData = [
    { name: "Todo", value: stats.todo },
    { name: "In Progress", value: stats.progress },
    { name: "Done", value: stats.done },
  ];

  const lineData = useMemo(() => {
    const days = [];
    const today = dayjs();
  
    for (let i = 6; i >= 0; i--) {
      const day = today.subtract(i, "day");
      const formatted = day.format("YYYY-MM-DD");
  
      const count = tasks.filter((task) =>
        dayjs(task.due_date).format("YYYY-MM-DD") === formatted
      ).length;
  
      days.push({
        day: day.format("ddd"),
        tasks: count,
      });
    }
  
    return days;
  }, [tasks]);

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  const filteredTasks = tasks.filter((task) =>
    [task.title, task.description, task.status, task.priority]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        const color =
          priority === "high"
            ? "red"
            : priority === "medium"
            ? "gold"
            : "green";
  
        return <Tag color={color}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "done"
            ? "green"
            : status === "in_progress"
            ? "blue"
            : "default";
  
        return (
          <Tag color={color}>
            {status.replace("_", " ").toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          Dashboard Overview
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {[
            { label: "Total Tasks", value: stats.total },
            { label: "To Do", value: stats.todo },
            { label: "In Progress", value: stats.progress },
            { label: "Completed", value: stats.done },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md"
            >
              <h3 className="text-gray-500 dark:text-gray-300">{item.label}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
            </motion.div>
          ))}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow max-w-lg w-full col-span-1"
        >
          <h2 className="font-bold mb-4">Task Analytics</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barCategoryGap="25%">
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4e8df4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow col-span-2 flex flex-col items-center"
        >
          <h2 className="font-bold mb-4">Task Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={90}
              outerRadius={130}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold"
              fill={isDark ? "#fff" : "#000"}
            >
              {stats.total}
            </text>

            <Tooltip />
          </PieChart>
          </ResponsiveContainer>
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
        >
          <h2 className="font-bold mb-4">Tasks Activity</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#4e8df4"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tasks */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          className={`p-5 rounded-xl shadow ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Tasks</h2>

          <Input
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="w-64"
          size="middle"
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        </div>

          <Table
            className={isDark ? "dark-table" : ""}
            columns={columns}
            dataSource={filteredTasks}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </motion.div>

      </div>
    </Layout>
  );
};

export default Dashboard;