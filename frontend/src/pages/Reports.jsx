import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Card,
  DatePicker,
  Input,
  Table,
  Row,
  Col,
  Switch,
  message,
  Button,
} from "antd";
import { getUsers, updateUserStatus } from "../services/userApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const { RangePicker } = DatePicker;

const Reports = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          className={`${
            record.status === "active" ? "!bg-black" : "bg-gray-500"
          }`}
        />
      ),
    },
  ];

  const handleStatusChange = async (id, checked) => {
    try {
      await updateUserStatus({
        userId: id,
        status: checked ? "active" : "inactive",
      });

      fetchUsers();
    } catch {
      message.error("Failed to update status");
    }
  };

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "inactive"
  ).length;

  const filteredUsers = users
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => {
      if (statusFilter === "all") return true;
      return user.status === statusFilter;
    });

  const handleExport = () => {
    const exportData = filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Status: user.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "users_report.xlsx");
  };

  // 📊 Pie Data
  const pieData = [
    { name: "Active", value: activeUsers },
    { name: "Inactive", value: inactiveUsers },
  ];

  // 📈 Line Data (User Growth by Date)
  const groupByDate = users.reduce((acc, user) => {
    const date = user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "Unknown";

    if (!acc[date]) {
      acc[date] = 0;
    }

    acc[date]++;
    return acc;
  }, {});

  const lineData = Object.keys(groupByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date,
      users: groupByDate[date],
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const chartColors = {
    text: isDark ? "#e5e7eb" : "#374151",   // gray-200 / gray-700
    grid: isDark ? "#374151" : "#e5e7eb",   // gray-700 / gray-200
    line: isDark ? "#60a5fa" : "#000000",   // blue-400 / black
    tooltipBg: isDark ? "#1f2937" : "#ffffff",
    tooltipBorder: isDark ? "#374151" : "#e5e7eb",
  };

  return (
    <Layout>
      <motion.div
        className="p-4 sm:p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 🔷 Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold">Reports Dashboard</h2>
          <p className="text-gray-500">Overview & analytics</p>
        </motion.div>

        {/* 🔥 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[ 
            { label: "Total Users", value: totalUsers },
            { label: "Active Users", value: activeUsers, color: "text-green-600" },
            { label: "Inactive Users", value: inactiveUsers, color: "text-red-600" },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                <h3 className="text-gray-500 dark:text-gray-300">{item.label}</h3>
                <p className={`text-2xl font-bold ${item.color || ""}`}>
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
  
          {/* 🥧 Pie Chart */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 dark:text-white p-5 rounded-xl shadow h-full">
              <h3 className="mb-4 font-semibold">User Status</h3>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={90} label>
                    <Cell fill={isDark ? "#22c55e" : "#000000"} /> {/* Active */}
                    <Cell fill={isDark ? "#ef4444" : "#d1d5db"} /> {/* Inactive */}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      color: chartColors.text,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 📈 Line Chart */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 dark:text-white p-5 rounded-xl shadow h-full">
              <h3 className="mb-4 font-semibold">User Growth</h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                    stroke={chartColors.text}
                    tick={{ fill: chartColors.text }}
                  />

                  <YAxis
                    stroke={chartColors.text}
                    tick={{ fill: chartColors.text }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      color: chartColors.text,
                    }}
                    labelStyle={{ color: chartColors.text }}
                  />

                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={chartColors.line}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* 🔍 Filters */}
        <motion.div variants={itemVariants}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <RangePicker style={{ width: "100%" }} />

            <div className="flex flex-wrap gap-2">
              {["all", "active", "inactive"].map((status) => (
                <Button
                  key={status}
                  className={`rounded-lg px-4 ${
                    statusFilter === status
                      ? "!bg-black !text-white"
                      : "!bg-white !text-gray-600"
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Export CSV */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.0}}
          whileTap={{ scale: 1.0}}
          className="flex justify-end mb-4"
        >
          <Button
            className="!bg-black hover:!bg-black/80 !text-white !border-none rounded-lg px-5 dark:!bg-gray-700 dark:hover:!bg-gray-600"
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </motion.div>

        {/* 📊 Table */}
        <motion.div variants={itemVariants}>
        <Card
          className={`shadow rounded-xl border-none ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >  
          <Table
            className={isDark ? "dark-table" : ""}
            columns={columns}
            dataSource={filteredUsers}
            pagination={{ pageSize: 5 }}
          />
        </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Reports;
