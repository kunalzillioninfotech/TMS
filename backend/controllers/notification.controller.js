const notificationService = require("../services/notification.service");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications =
      await notificationService.getNotificationsByUser(userId);

    res.json(notifications);
  } catch {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

exports.markAsRead = async (req, res) => {
    try {
      const { id } = req.params;
  
      await notificationService.markAsRead(id);
  
      res.json({ success: true });
    } catch {
      res.status(500).json({ message: "Error updating notification" });
    }
};