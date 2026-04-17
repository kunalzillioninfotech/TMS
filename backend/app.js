const express = require("express");
const cors = require("cors");
require("dotenv").config();
const notificationRoutes = require("./routes/notification.routes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/task.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;