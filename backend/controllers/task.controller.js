const taskService = require("../services/task.service");
const db = require("../config/db");
const notificationService = require("../services/notification.service");
const emailService = require("../services/email.service");
const pushService = require("../services/push.service");
const { taskAssignedTemplate } = require("../utils/emailTemplates");

exports.createTask = async (req, res) => {
  try {
    const { title, priority, due_date, assigned_to } = req.body;

    if (!title) return res.status(400).json({ message: "Title required" });

    if (!["low","medium","high"].includes(priority))
      return res.status(400).json({ message: "Invalid priority" });

    if (new Date(due_date) < new Date())
      return res.status(400).json({ message: "Invalid date" });

    const [userCheck] = await db.execute(
      "SELECT id, email, fcm_token FROM users WHERE id=?",
      [assigned_to]
    );

    const [creatorData] = await db.execute(
      "SELECT name FROM users WHERE id=?",
      [req.user.id]
    );
    
    const creatorName = creatorData[0]?.name || "Someone";
    const message = `${creatorName} has assigned you a task: ${title}`;

    if (!userCheck.length)
      return res.status(400).json({ message: "User not found" });

    if (req.user.role === "employee" && req.user.id !== assigned_to)
      return res.status(403).json({ message: "Forbidden" });

    // ✅ Create Task
    await taskService.createTask({
      ...req.body,
      created_by: req.user.id,
    });

    const assignedUser = userCheck[0];

    // 🔔 Create Notification
    await notificationService.createNotification({
      userId: assigned_to,
      message: message,
      type: "task_assigned",
    });

    // 📧 Send Email
    await emailService.sendEmail({
      to: assignedUser.email,
      subject: "New Task Assigned",
      html: taskAssignedTemplate({
        name: creatorName || "User",
        title,
      }),
    });

    if (assignedUser.fcm_token) {
      pushService.sendPushNotification({
        token: assignedUser.fcm_token,
        title: "New Task Assigned",
        body: message,
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTasks = async (req, res) => {
  const tasks = await taskService.getTasks(req.user);
  res.json(tasks);
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await taskService.updateTaskStatus(id, status);

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};