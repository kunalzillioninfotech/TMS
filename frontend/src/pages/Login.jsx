import React, { useState, useEffect } from "react";
import { Button, message, Checkbox } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import API from "../services/api";

const Login = ({ setIsRegister }) => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    setRememberMe(remembered);
    if (remembered) {
      const savedEmail = localStorage.getItem("savedEmail") || "";
      setForm((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await API.post("/login", form);

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", form.email);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", res.data.token);
        localStorage.setItem("rememberMe", "false");
        localStorage.removeItem("token");
        localStorage.removeItem("savedEmail");
      }

      message.success("Login successful");
      window.location.reload();
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">

        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black flex items-center justify-center">
          <UserOutlined className="text-white text-2xl" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-500 mb-6">Sign in to continue</p>

        <div className="text-left mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <div className="relative mt-1">
            <MailOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 h-11 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none px-3"
              disabled={loading}
            />
          </div>
        </div>

        <div className="text-left mb-4">
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative mt-1">
            <LockOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 h-11 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none px-3"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="!text-black"
          >
            <span className="text-gray-700">Remember Me</span>
          </Checkbox>

          <span className="text-sm text-gray-500 cursor-pointer hover:text-black">
            Forgot password?
          </span>
        </div>

        <Button
          block
          loading={loading}
          disabled={loading || !form.email || !form.password}
          onClick={handleLogin}
          className="!bg-black !text-white !h-11 !rounded-lg hover:!bg-gray-800"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="text-sm text-gray-500 mt-4 hover:text-black">
          Need an account?{" "}
          <span
            className="cursor-pointer hover:text-black font-semibold"
            onClick={() => setIsRegister(true)}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;