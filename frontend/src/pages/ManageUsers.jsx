// import React, { useEffect, useState } from "react";
// import { Table, Button } from "antd";
// import { getUsers } from "../services/userApi";
// import Layout from "../components/Layout";

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [isDark, setIsDark] = useState(
//     document.documentElement.classList.contains("dark")
//   );

//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       setIsDark(document.documentElement.classList.contains("dark"));
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await getUsers();
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const columns = [
//     { title: "Name", dataIndex: "name", width: 200 },
//     { title: "Email", dataIndex: "email", width: 300 },
//     { title: "Role", dataIndex: "role", width: 150 },
//   ];

//   return (
//     <Layout>
//       <div
//         className={`w-full max-w-full p-3 sm:p-6 rounded-xl ${
//           isDark ? "bg-gray-800 text-white" : "bg-white text-black"
//         }`}
//       >
//         <h2 className="text-lg sm:text-xl font-bold mb-4">Manage Users</h2>

//         <div className="w-full overflow-x-auto">
//           <Table
//             className={isDark ? "dark-table" : ""}
//             dataSource={users}
//             rowKey="_id"
//             columns={columns}
//             scroll={{ x: "max-content" }}
//             pagination={{ pageSize: 5 }}
//           />
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ManageUsers;


import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { Grid } from "antd";
import { getUsers } from "../services/userApi";
import Layout from "../components/Layout";

const { useBreakpoint } = Grid;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
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

    // Hide email column on mobile
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
          {role?.replace('_', ' ').toUpperCase()}
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

        <Table
          className={isDark ? "dark-table" : ""}
          dataSource={users}
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
