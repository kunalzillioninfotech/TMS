import React, { useEffect, useState, useMemo } from "react";
import { Table, Tag, Input } from "antd";
import { Grid } from "antd";
import { getUsers } from "../services/userApi";
import Layout from "../components/Layout";

const { useBreakpoint } = Grid;
const { Search } = Input;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const screens = useBreakpoint();
  const isMobile = !screens.md;

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

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [users, searchText]);

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold">{record.name}</span>
          {isMobile && (
            <span className="text-xs text-gray-500">{record.email}</span>
          )}
        </div>
      ),
    },

    !isMobile && {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "super_admin" ? "red" : "blue"}>
          {role?.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
  ].filter(Boolean);

  return (
    <Layout>
      <div
        className={`w-full p-3 sm:p-6 rounded-xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Manage Users
        </h2>

        <Search
          placeholder="Search by name or email..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4"
        />

        <Table
          className={isDark ? "dark-table" : ""}
          dataSource={filteredUsers}
          rowKey="_id"
          columns={columns}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </div>
    </Layout>
  );
};

export default ManageUsers;