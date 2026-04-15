import React, { useState } from "react";
import { Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, UserAddOutlined } from "@ant-design/icons";
import API from "../services/api";

const Register = ({ setIsRegister }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Send role as 'employee' by default
      await API.post("/register", { ...form, role: "employee" });

      message.success("Registration successful! Please login.");

      setIsRegister(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">

        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black flex items-center justify-center">
          <UserAddOutlined className="text-white text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-500 mb-6">Register to get started</p>

        <div className="text-left mb-4">
          <label className="text-sm text-gray-600">Name</label>
          <div className="relative mt-1">
            <UserOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 h-11 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none px-3"
              disabled={loading}
            />
          </div>
        </div>

        <div className="text-left mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <div className="relative mt-1">
            <MailOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 h-11 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none px-3"
              disabled={loading}
            />
          </div>
        </div>

        <div className="text-left mb-6">
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative mt-1">
            <LockOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 h-11 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none px-3"
              disabled={loading}
            />
          </div>
        </div>

        <Button
          block
          loading={loading}
          disabled={!form.name || !form.email || !form.password || loading}
          onClick={handleRegister}
          className="!bg-black !text-white !h-11 !rounded-lg hover:!bg-gray-800"
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <div className="text-sm text-gray-500 mt-4 hover:text-black">
          Already have an account?{" "}
          <span
            className="cursor-pointer hover:text-black font-semibold"
            onClick={() => setIsRegister(false)}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;