const express = require("express");
const {
  getUsers,
  getUser,
  searchUsersByEmail,
} = require("../controller/user.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// User routes - all protected
router.get("/", protect, getUsers);
router.get("/search", protect, searchUsersByEmail);
router.get("/:id", protect, getUser);

module.exports = router;
