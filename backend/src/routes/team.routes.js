const express = require("express");
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  inviteUser,
  removeMember,
  updateMemberRole,
} = require("../controller/team.controller");

const {
  getTeamTasks,
  createTeamTask,
} = require("../controller/task.controller");

const { getTeamInvites } = require("../controller/invite.controller");

const {
  protect,
  checkTeamMembership,
  checkTeamAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Team routes
router.route("/").get(protect, getTeams).post(protect, createTeam);

router
  .route("/:id")
  .get(protect, getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

// Team member management
router.post("/:teamId/invite", protect, checkTeamMembership, inviteUser);
router.delete("/:teamId/members/:userId", protect, removeMember);
router.put("/:teamId/members/:userId/role", protect, updateMemberRole);

// Team tasks
router
  .route("/:teamId/tasks")
  .get(protect, checkTeamMembership, getTeamTasks)
  .post(protect, checkTeamMembership, createTeamTask);

// Team invites
router.get("/:teamId/invites", protect, checkTeamAdmin, getTeamInvites);

module.exports = router;
