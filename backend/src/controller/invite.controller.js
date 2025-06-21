const Invite = require("../modals/invite.modal");
const Team = require("../modals/team.modal");
const User = require("../modals/user.modal");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all invites for logged in user
// @route   GET /api/invites
// @access  Private
exports.getUserInvites = asyncHandler(async (req, res, next) => {
  const { status = "pending" } = req.query;

  const invites = await Invite.find({
    invitedUserEmail: req.user.email,
    status,
  })
    .populate("teamId", "name description ownerId")
    .populate("invitedBy", "name email")
    .sort("-createdAt");

  // Mark expired invites
  const now = new Date();
  for (const invite of invites) {
    if (invite.status === "pending" && invite.expiresAt < now) {
      invite.status = "expired";
      await invite.save();
    }
  }

  res.status(200).json({
    success: true,
    count: invites.length,
    data: invites,
  });
});

// @desc    Get invite by ID
// @route   GET /api/invites/:id
// @access  Private
exports.getInvite = asyncHandler(async (req, res, next) => {
  const invite = await Invite.findById(req.params.id)
    .populate("teamId", "name description ownerId")
    .populate("invitedBy", "name email");

  if (!invite) {
    return next(new ErrorResponse("Invite not found", 404));
  }

  // Check if user is the invited user
  if (invite.invitedUserEmail !== req.user.email) {
    return next(new ErrorResponse("Not authorized to view this invite", 403));
  }

  // Check if invite is expired
  if (invite.isExpired() && invite.status === "pending") {
    invite.status = "expired";
    await invite.save();
  }

  res.status(200).json({
    success: true,
    data: invite,
  });
});

// @desc    Accept team invite
// @route   POST /api/invites/:id/accept
// @access  Private
exports.acceptInvite = asyncHandler(async (req, res, next) => {
  const invite = await Invite.findById(req.params.id).populate("teamId");

  if (!invite) {
    return next(new ErrorResponse("Invite not found", 404));
  }

  // Check if user is the invited user
  if (invite.invitedUserEmail !== req.user.email) {
    return next(new ErrorResponse("Not authorized to accept this invite", 403));
  }

  // Check if invite is still pending
  if (invite.status !== "pending") {
    return next(new ErrorResponse(`Invite is already ${invite.status}`, 400));
  }

  // Check if invite is expired
  if (invite.isExpired()) {
    invite.status = "expired";
    await invite.save();
    return next(new ErrorResponse("Invite has expired", 400));
  }

  // Check if team still exists
  const team = await Team.findById(invite.teamId);
  if (!team) {
    return next(new ErrorResponse("Team no longer exists", 404));
  }

  // Check if user is already a member
  if (team.isMember(req.user._id)) {
    return next(new ErrorResponse("User is already a team member", 400));
  }

  // Add user to team
  team.members.push({
    userId: req.user._id,
    role: invite.role,
  });
  await team.save();

  // Add team to user's teams array
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { teams: team._id },
  });

  // Update invite status
  invite.status = "accepted";
  invite.respondedAt = new Date();
  invite.invitedUserId = req.user._id;
  await invite.save();

  const populatedTeam = await Team.findById(team._id)
    .populate("ownerId", "name email")
    .populate("members.userId", "name email avatar");

  res.status(200).json({
    success: true,
    message: "Invite accepted successfully",
    data: {
      invite,
      team: populatedTeam,
    },
  });
});

// @desc    Reject team invite
// @route   POST /api/invites/:id/reject
// @access  Private
exports.rejectInvite = asyncHandler(async (req, res, next) => {
  const invite = await Invite.findById(req.params.id);

  if (!invite) {
    return next(new ErrorResponse("Invite not found", 404));
  }

  // Check if user is the invited user
  if (invite.invitedUserEmail !== req.user.email) {
    return next(new ErrorResponse("Not authorized to reject this invite", 403));
  }

  // Check if invite is still pending
  if (invite.status !== "pending") {
    return next(new ErrorResponse(`Invite is already ${invite.status}`, 400));
  }

  // Update invite status
  invite.status = "rejected";
  invite.respondedAt = new Date();
  invite.invitedUserId = req.user._id;
  await invite.save();

  res.status(200).json({
    success: true,
    message: "Invite rejected successfully",
    data: invite,
  });
});

// @desc    Get team invites (for team admins)
// @route   GET /api/teams/:teamId/invites
// @access  Private
exports.getTeamInvites = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;
  const { status } = req.query;

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Check if user is team admin or owner
  if (!team.isAdminOrOwner(req.user._id)) {
    return next(new ErrorResponse("Not authorized to view team invites", 403));
  }

  const filter = { teamId };
  if (status) {
    filter.status = status;
  }

  const invites = await Invite.find(filter)
    .populate("invitedBy", "name email")
    .populate("invitedUserId", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: invites.length,
    data: invites,
  });
});

// @desc    Cancel team invite (for team admins)
// @route   DELETE /api/invites/:id
// @access  Private
exports.cancelInvite = asyncHandler(async (req, res, next) => {
  const invite = await Invite.findById(req.params.id).populate("teamId");

  if (!invite) {
    return next(new ErrorResponse("Invite not found", 404));
  }

  const team = await Team.findById(invite.teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Check if user is team admin/owner or the one who sent the invite
  const canCancel =
    team.isAdminOrOwner(req.user._id) ||
    invite.invitedBy.toString() === req.user._id.toString();

  if (!canCancel) {
    return next(new ErrorResponse("Not authorized to cancel this invite", 403));
  }

  // Can only cancel pending invites
  if (invite.status !== "pending") {
    return next(
      new ErrorResponse(`Cannot cancel ${invite.status} invite`, 400)
    );
  }

  await invite.deleteOne();

  res.status(200).json({
    success: true,
    message: "Invite cancelled successfully",
  });
});
