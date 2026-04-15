const db = require("../config/db");

exports.createNotification = async ({ userId, message, type }) => {
  await db.execute(
    "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)",
    [userId, message, type]
  );
};

exports.getNotificationsByUser = async (userId) => {
  const [rows] = await db.execute(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

exports.markAsRead = async (notificationId) => {
    await db.execute(
        "UPDATE notifications SET is_read = TRUE WHERE id = ?",
        [notificationId]
    );
};