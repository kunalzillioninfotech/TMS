import React, { useState, useEffect } from "react";
import { Button } from "antd";
import {jwtDecode} from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

// Lucide icons
import { ClipboardList, Users, BarChart2, User, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { getProfile } from "../services/userApi";

const Sidebar = ({ onLogout }) => {
  const [userType, setUserType] = useState("employee");
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.role || "employee");
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.data && res.data.name) {
          setUserName(res.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} />, visibleTo: ["employee", "super_admin"] },
    { label: "Tasks", path: "/tasks", icon: <ClipboardList size={18} />, visibleTo: ["employee", "super_admin"] },
    { label: "Manage Users", path: "/manage-users", icon: <Users size={18} />, visibleTo: ["super_admin"] },
    { label: "Reports", path: "/reports", icon: <BarChart2 size={18} />, visibleTo: ["super_admin"] },
    { label: "Profile", path: "/profile", icon: <User size={18} />, visibleTo: ["employee", "super_admin"] },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow z-50 flex justify-between items-center p-4 h-16">
        <h2 className="text-lg font-bold">TMS</h2>
        <button
          className="p-2 bg-gray-200 rounded dark:bg-gray-500"
          onClick={() => setIsOpen(true)}
        >
          <Menu/>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-md z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 w-64 flex flex-col`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">My Dashboard</h2>
            <span className="text-gray-500 capitalize">{userName || ""}</span>
          </div>

          <button
            className="md:hidden text-xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(
            (item) =>
              item.visibleTo.includes(userType) && (
                <div
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    location.pathname === item.path
                      ? "bg-gray-300 dark:text-gray-800 font-semibold"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700" 
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              )
          )}
        </nav>

        <div className="p-4 border-t">
          <div
            onClick={onLogout}
            className="flex items-center gap-2 p-2 rounded cursor-pointer text-red-600 hover:bg-red-500/10 transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;