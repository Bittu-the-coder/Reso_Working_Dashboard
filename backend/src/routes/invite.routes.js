const express = require("express");
const {
  getUserInvites,
  getInvite,
  acceptInvite,
  rejectInvite,
  cancelInvite,
} = require("../controller/invite.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Invite routes
router.route("/").get(protect, getUserInvites);

router.route("/:id").get(protect, getInvite).delete(protect, cancelInvite);

router.post("/:id/accept", protect, acceptInvite);
router.post("/:id/reject", protect, rejectInvite);

module.exports = router;
