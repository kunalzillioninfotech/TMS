const express = require("express");
const cors = require("cors");
require("dotenv").config();
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/task.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api/notifications", notificationRoutes);

module.exports = app;