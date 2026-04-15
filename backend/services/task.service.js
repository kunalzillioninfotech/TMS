const db = require("../config/db");

exports.createTask = async (data) => {
  const query = `
    INSERT INTO tasks 
    (title, description, priority, due_date, assigned_to, created_by, project_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'todo')
  `;

  return db.execute(query, [
    data.title,
    data.description,
    data.priority,
    data.due_date,
    data.assigned_to,
    data.created_by,
    data.project_id,
  ]);
};

exports.getTasks = async (user) => {
  let query = "SELECT * FROM tasks";

  if (user.role === "employee") {
    query = "SELECT * FROM tasks WHERE assigned_to=?";
    const [rows] = await db.execute(query, [user.id]);
    return rows;
  }

  const [rows] = await db.execute(query);
  return rows;
};

exports.updateTaskStatus = async (taskId, status) => {
  await db.execute(
    "UPDATE tasks SET status=? WHERE id=?",
    [status, taskId]
  );
};

exports.createNotification = async ({ userId, message, type }) => {
  await db.execute(
    "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)",
    [userId, message, type]
  );
};