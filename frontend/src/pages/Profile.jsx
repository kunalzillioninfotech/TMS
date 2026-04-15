import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../services/userApi";
import { Button, Input, message, Upload, Avatar, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Layout from "../components/Layout";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profile_pic: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getProfile();
    setProfile(res.data);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profile.name);

      if (file) {
        formData.append("profile_pic", file);
      }

      await updateProfile(formData);

      message.success("Profile updated");
      fetchProfile();
    } catch {
      message.error("Update failed");
    }
  };

  // 🔹 Handle Password Change
  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return message.error("Passwords do not match");
    }

    try {
      await changePassword(passwords);
      message.success("Password updated");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      message.error("Failed to update password");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 dark:from-gray-900 dark:to-gray-900">
        {/* 🔷 Profile Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 🔹 Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 h-32 relative" />

          {/* 🔹 Avatar Section */}
          <div className="flex flex-col items-center -mt-16 px-6 pb-6">
            <div className="relative group">
              <Avatar
                size={120}
                src={profile.profile_pic}
                className="border-4 border-white shadow-lg cursor-pointer"
                onClick={() => profile.profile_pic && setIsModalOpen(true)}
              >
                {profile.name?.charAt(0)}
              </Avatar>

              {/* Upload overlay */}
              <Upload
                beforeUpload={(file) => {
                  setFile(file);

                  const previewUrl = URL.createObjectURL(file);
                  setProfile((prev) => ({
                    ...prev,
                    profile_pic: previewUrl,
                  }));

                  return false;
                }}
                showUploadList={false}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition">
                  <UploadOutlined style={{ color: "#fff", fontSize: 20 }} />
                </div>
              </Upload>
            </div>

            <h2 className="mt-4 text-xl font-semibold dark:text-black">{profile.name}</h2>
            <p className="text-gray-500">{(profile.role?.replace('_', ' ')?.replace(/\b\w/g, char => char.toUpperCase()))}</p>
          </div>

          {/* 🔹 Profile Info */}
          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="text-gray-600 text-sm">Name</label>
              <Input
                value={profile.name}
                size="large"
                disabled
                className="mt-1 rounded-lg"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <Input
                value={profile.email}
                size="large"
                disabled
                className="mt-1 rounded-lg"
              />
            </div>

            <Button
              type="primary"
              size="large"
              block
              className="bg-black hover:bg-gray-800 border-none rounded-lg"
              onClick={handleSave}
            >
              Save Profile
            </Button>
          </div>

          {/* 🔐 Password Section */}
          <div className="border-t px-6 py-6 space-y-4 bg-gray-50">
            <h3 className="font-semibold text-lg dark:text-black">Change Password</h3>

            <Input.Password
              placeholder="Old Password"
              size="large"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />

            <Input.Password
              placeholder="New Password"
              size="large"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />

            <Input.Password
              placeholder="Confirm Password"
              size="large"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />

            <Button
              danger
              size="large"
              block
              className="rounded-lg"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* 🖼 Image Modal */}
        <Modal
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
          centered
          width="auto"
          styles={{ body: { padding: 0, background: "transparent" } }}
          maskStyle={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          closeIcon={
            <span
              style={{
                color: "#fff",
                background: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                padding: "6px 12px",
                fontSize: "18px",
              }}
            >
              ✕
            </span>
          }
        >
          <img
            src={profile.profile_pic}
            alt="Profile"
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Profile;
