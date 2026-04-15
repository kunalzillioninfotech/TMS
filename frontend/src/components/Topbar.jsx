import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { LogOut } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "../services/notificationApi";
import { message } from "antd";
import { getProfile } from "../services/userApi";

const Topbar = ({ onLogout }) => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const notificationsRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile");
    }
  };
  
  const fetchNotifications = async () => {
    const res = await getNotifications();
    setNotifications(res.data);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setOpenNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
  
      // update UI instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      message.success("Marked as read!");
      navigate("/tasks")
    } catch {
      console.error("Failed to mark as read");
    }
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.is_read));
    message.success("Cleared read notifications");
  };  

  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0 }}
      className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-4 sticky top-0 z-40 md:z-30"
    >
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Task Management</h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* 🔔 Notifications */}
        <div className="relative" ref={notificationsRef}>
          <BellOutlined
            className="text-xl cursor-pointer"
            onClick={() => setOpenNotifications(!openNotifications)}
          />
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
              {notifications.filter((n) => !n.is_read).length}
            </span>
          )}

          <AnimatePresence>
            {openNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-[-40px] mt-3 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 z-50"
              >
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id)}
                      className={`p-2 rounded cursor-pointer ${
                        n.is_read
                          ? "bg-gray-100 text-gray-400 dark:text-gray-800"
                          : "bg-white hover:bg-gray-100 font-medium"
                      }`}
                    >
                      {n.message}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center mt-4">
                  <span
                    onClick={handleClearRead}
                    className="text-sm text-red-500 cursor-pointer hover:underline"
                  >
                    Clear Read
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 👤 Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer border p-1 rounded-3xl border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-400  transition-colors duration-200"
            onClick={() => setOpenProfile(!openProfile)}
          >
            {profile?.profile_pic ? (
              <img
                src={profile.profile_pic}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserOutlined />
            )}
          </div>

          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-2 z-50"
              >
                <div
                  onClick={() => {
                    navigate("/profile");
                    setOpenProfile(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <UserOutlined />
                  <span>Profile</span>
                </div>

                <div
                  onClick={onLogout}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer text-red-600 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <LogOut size={18}/>
                  <span>Logout</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;