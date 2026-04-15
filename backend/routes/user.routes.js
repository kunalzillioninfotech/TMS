const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

router.get("/users", auth, ctrl.getUsers);
router.get("/profile", auth, ctrl.getProfile);
router.put("/user-status", auth, ctrl.updateUserStatus);
router.put("/profile", auth, upload.single("profile_pic"), ctrl.updateProfile);
router.put("/change-password", auth, ctrl.changePassword);

module.exports = router;