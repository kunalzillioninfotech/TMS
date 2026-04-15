const db = require("../config/db");

exports.getUsers = async () => {
  const [rows] = await db.execute(
    "SELECT id, name, email, role, status, created_at FROM users"
  );
  return rows;
};

exports.getUserById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, name, email, role, profile_pic, profile_pic_id FROM users WHERE id=?",
    [id]
  );
  return rows[0];
};

exports.updateProfile = async (id, name, profilePic, profilePicId) => {
  await db.execute(
    "UPDATE users SET name=?, profile_pic=?, profile_pic_id=? WHERE id=?",
    [name, profilePic, profilePicId, id]
  );
};

exports.updatePassword = async (id, hashedPassword) => {
  await db.execute(
    "UPDATE users SET password=? WHERE id=?",
    [hashedPassword, id]
  );
};

exports.getUserWithPassword = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE id=?",
    [id]
  );
  return rows[0];
};

exports.updateUser = async (id, name, avatar) => {
  await db.execute(
    "UPDATE users SET name=?, avatar=? WHERE id=?",
    [name, avatar, id]
  );
};

exports.updateUserStatus = async (id, status) => {
  await db.execute(
    "UPDATE users SET status=? WHERE id=?",
    [status, id]
  );
};