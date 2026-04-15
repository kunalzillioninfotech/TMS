const express = require("express");
const router = express.Router();
const {
  getNotifications, markAsRead
} = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware");
const { saveFcmToken } = require("../controllers/user.controller");

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markAsRead);
router.post("/save-token", auth, saveFcmToken);

module.exports = router;