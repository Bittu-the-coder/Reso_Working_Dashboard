const Team = require("../modals/team.modal");
const User = require("../modals/user.modal");
const Invite = require("../modals/invite.modal");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all teams for logged in user
// @route   GET /api/teams
// @access  Private
exports.getTeams = asyncHandler(async (req, res, next) => {
  const teams = await Team.find({
    "members.userId": req.user._id,
  })
    .populate("ownerId", "name email")
    .populate("members.userId", "name email avatar")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams,
  });
});

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id)
    .populate("ownerId", "name email")
    .populate("members.userId", "name email avatar");

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Check if user is a member
  if (!team.isMember(req.user._id)) {
    return next(new ErrorResponse("Not authorized to access this team", 403));
  }

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
exports.createTeam = asyncHandler(async (req, res, next) => {
  const { name, description, settings } = req.body;

  if (!name) {
    return next(new ErrorResponse("Please provide a team name", 400));
  }

  const team = await Team.create({
    name,
    description,
    ownerId: req.user._id,
    members: [
      {
        userId: req.user._id,
        role: "owner",
      },
    ],
    settings: settings || {},
  });

  // Add team to user's teams array
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { teams: team._id },
  });

  const populatedTeam = await Team.findById(team._id)
    .populate("ownerId", "name email")
    .populate("members.userId", "name email avatar");

  res.status(201).json({
    success: true,
    data: populatedTeam,
  });
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
exports.updateTeam = asyncHandler(async (req, res, next) => {
  let team = await Team.findById(req.params.id);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Check if user is owner or admin
  if (!team.isAdminOrOwner(req.user._id)) {
    return next(new ErrorResponse("Not authorized to update this team", 403));
  }

  const { name, description, settings } = req.body;

  team = await Team.findByIdAndUpdate(
    req.params.id,
    { name, description, settings },
    { new: true, runValidators: true }
  )
    .populate("ownerId", "name email")
    .populate("members.userId", "name email avatar");

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Only owner can delete team
  if (team.ownerId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Only team owner can delete the team", 403));
  }

  // Remove team from all members' teams array
  await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });

  // Delete all pending invites for this team
  await Invite.deleteMany({ teamId: team._id });

  await team.deleteOne();

  res.status(200).json({
    success: true,
    data: "Team deleted successfully",
  });
});

// @desc    Invite user to team
// @route   POST /api/teams/:teamId/invite
// @access  Private
exports.inviteUser = asyncHandler(async (req, res, next) => {
  const { email, role = "member", message } = req.body;
  const teamId = req.params.teamId;

  if (!email) {
    return next(new ErrorResponse("Please provide user email", 400));
  }

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Check if user can invite (owner, admin, or if settings allow member invites)
  const userRole = team.getUserRole(req.user._id);
  if (
    !userRole ||
    (userRole === "member" && !team.settings.allowMemberInvites)
  ) {
    return next(new ErrorResponse("Not authorized to invite users", 403));
  }

  // Check if user exists
  const invitedUser = await User.findOne({ email });

  // Check if user is already a team member
  if (invitedUser && team.isMember(invitedUser._id)) {
    return next(new ErrorResponse("User is already a team member", 400));
  }

  // Check if there's already a pending invite
  const existingInvite = await Invite.findOne({
    teamId,
    invitedUserEmail: email,
    status: "pending",
  });

  if (existingInvite) {
    return next(new ErrorResponse("User already has a pending invite", 400));
  }

  // Create invite
  const invite = await Invite.create({
    teamId,
    invitedBy: req.user._id,
    invitedUserEmail: email,
    invitedUserId: invitedUser ? invitedUser._id : null,
    role,
    message,
  });

  const populatedInvite = await Invite.findById(invite._id)
    .populate("teamId", "name description")
    .populate("invitedBy", "name email");

  // TODO: Send email notification here
  console.log(`Invite sent to ${email} for team ${team.name}`);

  res.status(201).json({
    success: true,
    data: populatedInvite,
  });
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:teamId/members/:userId
// @access  Private
exports.removeMember = asyncHandler(async (req, res, next) => {
  const { teamId, userId } = req.params;

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Check if user is owner or admin, or removing themselves
  const canRemove =
    team.isAdminOrOwner(req.user._id) || req.user._id.toString() === userId;

  if (!canRemove) {
    return next(new ErrorResponse("Not authorized to remove this member", 403));
  }

  // Cannot remove owner
  if (team.ownerId.toString() === userId) {
    return next(new ErrorResponse("Cannot remove team owner", 400));
  }

  // Remove member from team
  team.members = team.members.filter(
    (member) => member.userId.toString() !== userId
  );
  await team.save();

  // Remove team from user's teams array
  await User.findByIdAndUpdate(userId, {
    $pull: { teams: teamId },
  });

  res.status(200).json({
    success: true,
    data: "Member removed successfully",
  });
});

// @desc    Update member role
// @route   PUT /api/teams/:teamId/members/:userId/role
// @access  Private
exports.updateMemberRole = asyncHandler(async (req, res, next) => {
  const { teamId, userId } = req.params;
  const { role } = req.body;

  if (!["admin", "member"].includes(role)) {
    return next(new ErrorResponse("Invalid role", 400));
  }

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  // Only owner can change roles
  if (team.ownerId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Only team owner can change member roles", 403)
    );
  }

  // Cannot change owner role
  if (team.ownerId.toString() === userId) {
    return next(new ErrorResponse("Cannot change owner role", 400));
  }

  // Find and update member role
  const memberIndex = team.members.findIndex(
    (member) => member.userId.toString() === userId
  );

  if (memberIndex === -1) {
    return next(new ErrorResponse("User is not a team member", 404));
  }

  team.members[memberIndex].role = role;
  await team.save();

  res.status(200).json({
    success: true,
    data: "Member role updated successfully",
  });
});
