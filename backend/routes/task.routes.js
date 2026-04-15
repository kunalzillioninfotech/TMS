const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const auth = require("../middleware/auth.middleware");

router.post("/tasks", auth, ctrl.createTask);
router.get("/tasks", auth, ctrl.getTasks);
router.put("/tasks/:id/status", auth, ctrl.updateTaskStatus);

module.exports = router;