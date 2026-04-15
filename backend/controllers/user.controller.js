const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const userService = require("../services/user.service");
const db = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "super_admin") {
      // super_admin sees everyone
      users = await userService.getUsers();
    } else if (req.user.role === "employee") {
      // employees can see all employees but not super_admin
      const allUsers = await userService.getUsers();
      users = allUsers.filter(u => u.role !== "super_admin");
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const existingUser = await userService.getUserById(req.user.id);

    let profilePic = existingUser.profile_pic;
    let profilePicId = existingUser.profile_pic_id;

    // ✅ If new image uploaded
    if (req.file) {
      // delete old image from cloudinary
      if (existingUser.profile_pic_id) {
        await cloudinary.uploader.destroy(existingUser.profile_pic_id);
      }

      profilePic = req.file.path;
      profilePicId = req.file.filename;
    }

    await userService.updateProfile(
      req.user.id,
      name,
      profilePic,
      profilePicId
    );

    res.json({ message: "Profile updated", profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await userService.getUserWithPassword(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(req.user.id, hashed);

    res.json({ message: "Password updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // 🔐 Only admin
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await userService.updateUserStatus(userId, status);

    res.json({ message: "Status updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    await db.execute(
      "UPDATE users SET fcm_token=? WHERE id=?",
      [token, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving token" });
  }
};