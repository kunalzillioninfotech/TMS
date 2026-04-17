import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import ManageUsers from "./pages/ManageUsers";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { useEffect, useState } from "react";
import { saveFcmToken } from "./services/notificationApi";
import AIChat from "./components/AIChat";

function App() {
  const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) return;
      const permission = await Notification.requestPermission();
  
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BFSBUt8m1u0j1RvFvHpt_PAhibV3vaRwBePf1oqTUYITj5E59Np4JVsnOR4jGDTPWxR8xRRuR1UQ6SjBHpQ7HCs",
        });
  
        console.log("FCM Token:", token);
  
        // 👉 Send token to backend
        await saveFcmToken(token);
      }
    };
  
    requestPermission();
  
    // Foreground message
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);

      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
      });
    });
  }, []);

  if (!token) {
    return isRegister ? (
      <Register setIsRegister={setIsRegister} />
    ) : (
      <Login setIsRegister={setIsRegister} />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-assistant" element={<AIChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
