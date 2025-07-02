const express = require("express");
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    updateUser,
    updatePassword,
    getAllUsers,
    checkNotification,
    deleteNotificationById,
    getAllNotification,
    notifyUserByEmail,
} = require("../controllers/user.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/multer.js");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, getMe);

// Make logout endpoint unprotected to avoid token verification issues
router.route("/logout").get(logoutUser);
router.route("/update").put(protect, upload.single("avatar"), updateUser);
router.route("/updatepassword").put(protect, updatePassword);

router.route("/getallusers").get(protect, getAllUsers);

// check notifications and update
router.route("/notifications").get(protect, getAllNotification);
router
    .route("/checknotification/:id")
    .delete(protect, deleteNotificationById)
    .get(protect, checkNotification);

router.route("/sendemail").post(protect, async (req, res) => {
    const { userId, subject, message } = req.body;
    try {
        await notifyUserByEmail(userId, subject, message);
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
