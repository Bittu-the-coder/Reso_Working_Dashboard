const Team = require("../models/team.model");
const asyncHandler = require("../utils/asyncHandler");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse");
const User = require("../models/User.model");
const { uploadToImageKit } = require("../utils/imageKit");
const { sendTokenResponse } = require("../utils/jwt");

const createTeam = asyncHandler(async (req, res, next) => {
  const { name, description, department } = req.body;

  try {
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return next(new ErrorResponse("Team already exists", 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    const teamData = {
      name,
      description,
      department,
      ownerId: req.user._id,
      createdBy: req.user._id,
      members: [{
        userId: req.user._id,
        name: user.fullName,
        email: user.email,
        isAcceptedInvite: true,
        role: 'admin'
      }]
    };

    // Handle file upload if exists
    if (req.file) {
      const upload = await uploadToImageKit(req.file);
      teamData.avatar = upload;
    }

    // Create team
    const team = await Team.create(teamData);

    // Update user's teams
    user.teams.push({
      teamId: team._id,
      role: 'admin',
    });
    await user.save();

    sendSuccess(res, team, "Team created successfully", 201);
  } catch (error) {
    console.error("Error while creating team:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  try {
    ;
    const team = await Team.findById(teamId).populate("ownerId", "name email");
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }
    const isMember = team.members.some(member => member.userId?._id.toString() === req.user._id.toString());
    if (!isMember) {
      return next(new ErrorResponse("You are not a member of this team", 403));
    }
    sendSuccess(res, team, "Team fetched successfully");
  } catch (error) {
    console.error("Error while fetching team:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getMyTeams = asyncHandler(async (req, res, next) => {
  try {
    ;
    const teams = await Team.find({ members: { $elemMatch: { userId: req.user._id } } }).populate("ownerId", "name email");
    sendSuccess(res, { teams }, "My teams fetched successfully");
  } catch (error) {
    console.error("Error while fetching my teams:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const deleteTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }
    const isOwner = team.ownerId.toString() === req.user._id.toString();
    if (!isOwner) {
      return next(new ErrorResponse("You are not authorized to delete this team", 403));
    }
    await team.deleteOne();
    // delete the tasks also if exits
    const teamTasks = await Task.deleteMany({ teamId: teamId });
    if (teamTasks.deletedCount > 0) {
      console.log(`Deleted ${teamTasks.deletedCount} tasks for team ${teamId}`);
    }

    sendSuccess(res, team, "Team deleted successfully");
  } catch (error) {
    console.error("Error while deleting team:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const updateTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  const { name, description, department } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    // Only the owner can update the team
    if (team.ownerId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("You are not authorized to update this team", 403));
    }

    await Team.updateOne({ _id: teamId }, {
      $set:
      {
        name: name,
        description: description,
        department: department
      }
    });

    sendSuccess(res, team, "Team updated successfully");
  } catch (error) {
    console.error("Error while updating team:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getTeamMembers = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;

  try {
    const team = await Team.findById(teamId).populate("members.userId", "name email");
    isMember = team.members.some(member => member.userId?._id.toString() === req.user._id.toString());
    if (!isMember) {
      return next(new ErrorResponse("You are not a member of this team", 403));
    }
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }
    sendSuccess(res, { members: team.members }, "Team members fetched successfully");
  } catch (error) {
    console.error("Error while fetching team members:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const addTeamMember = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  const { role, name, email, department } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new ErrorResponse("User not found", 404));
    }
    const userId = existingUser._id;

    const isOwner = team.ownerId.toString() === req.user._id.toString();
    const isAdmin = team.members.some(member => member.userId?._id.toString() === req.user._id.toString() && member.role === 'admin');
    console.log("is owner, is Admin ", isOwner, isAdmin);
    if (!isOwner && !isAdmin) {
      return next(new ErrorResponse("You are not authorized to add team members", 403));
    }

    // Check if the user is already invited
    const alreadyInvited = team.invitations.find(
      (inv) => inv.userId?._id.toString() === userId.toString()
    );

    const alreadyMember = team.members.find(
      (mem) => mem.userId?._id.toString() === userId.toString()
    );

    if (alreadyInvited || alreadyMember) {
      return next(new ErrorResponse("User is already invited or a member", 400));
    }

    //add notification and team in user section
    existingUser.notifications.push({
      type: 'invitation',
      message: `You are invited by ${req.user.fullName} to join ${team.name}`,
    })

    existingUser.teams.push({
      teamId: teamId,
      role: role
    })

    // Add to invitations
    team.invitations.push({
      userId,
      invitedBy: req.user._id,
      status: 'pending',
    });

    // Add to members (with isAcceptedInvite = false)
    team.members.push({
      userId,
      name,
      email,
      role,
      department,
      isAcceptedInvite: false,
    });

    await team.save();
    await existingUser.save()

    // Optionally notify the invited user here
    // e.g., sendNotification(userId, "You've been invited to join a team")

    sendSuccess(res, team, "Invitation sent and member added to the team");
  } catch (error) {
    console.error("Error while adding team member:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getTeamMemberById = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  const userId = req.params.memberId;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }
    const member = team.members.find((mem) => mem.userId?._id.toString() === userId);
    if (!member) {
      return next(new ErrorResponse("Member not found", 404));
    }
    sendSuccess(res, member, "Team member fetched successfully");
  } catch (error) {
    console.error("Error while fetching team member:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const removeTeamMember = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  const memberId = req.params.memberId;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    const isAdmin = team.members.some(
      (mem) => mem.userId?._id.toString() === req.user._id.toString() && mem.role === "admin"
    );

    if (!isAdmin) {
      return next(new ErrorResponse("You are not authorized to remove team members", 403));
    }

    const memberIndex = team.members.findIndex(
      (mem) => mem._id.toString() === memberId
    );

    const invitedMemberIndex = team.invitations.findIndex(
      (inv) => inv._id.toString() === memberId
    );

    const checkIfDeletedMemberIsOwner = memberIndex !== -1 && team.members[memberIndex].userId?._id.toString() === team.ownerId.toString();

    if (checkIfDeletedMemberIsOwner) {
      return next(new ErrorResponse("You cannot remove the owner of the team", 400));
    }

    if (memberIndex === -1 && invitedMemberIndex === -1) {
      return next(new ErrorResponse("Member or invitation not found", 404));
    }

    if (memberIndex !== -1) {
      team.members.splice(memberIndex, 1);
    }

    if (invitedMemberIndex !== -1) {
      team.invitations.splice(invitedMemberIndex, 1);
    }

    await team.save();

    sendSuccess(res, {}, "Team member removed successfully");
  } catch (error) {
    console.error("Error while removing team member:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const updateTeamMember = asyncHandler(async (req, res, next) => {
  const teamId = req.params.id;
  const memberId = req.params.memberId;
  const { role, name, email, department } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    // Check if the requester is an admin in the team
    const isAdmin = team.members.some(
      (mem) =>
        mem.userId?._id.toString() === req.user._id.toString() && mem.role === "admin"
    );

    if (!isAdmin) {
      return next(new ErrorResponse("You are not authorized to update team members", 403));
    }

    // Validate user by email
    const targetUser = team.members.find((mem) => mem._id.toString() === memberId);
    if (!targetUser) {
      return next(new ErrorResponse("User not found with this email", 404));
    }

    // Find the team member to update
    const memberIndex = team.members.findIndex(
      (mem) => mem._id.toString() === memberId
    );

    if (memberIndex === -1) {
      return next(new ErrorResponse("Team member not found", 404));
    }

    // Update fields
    if (role) team.members[memberIndex].role = role;
    if (name) team.members[memberIndex].name = name;
    if (email) team.members[memberIndex].email = email;
    if (department) team.members[memberIndex].department = department;

    await team.save();
    sendSuccess(res, team.members[memberIndex], "Team member updated successfully");
  } catch (error) {
    console.error("Error while updating team member:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});


const acceptTeamInvitation = asyncHandler(async (req, res, next) => {
  try {
    ;

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Find first 'invitation' type notification that is already read
    const readInvitation = user.notifications.find(
      (n) => n.type === 'invitation' && n.isRead === true
    );

    if (!readInvitation) {
      return next(new ErrorResponse("No read invitation notification found", 404));
    }

    // Find all teamIds where user is invited
    const teamIds = user.teams.map(t => t.teamId);
    let invitationAccepted = false;

    for (const teamId of teamIds) {
      const team = await Team.findById(teamId);
      if (!team) continue;

      // Find invitation in the team
      const invitationIndex = team.invitations.findIndex(
        (inv) => inv.userId.toString() === req.user._id.toString()
      );

      if (invitationIndex === -1) continue;

      const memberIdx = team.members.findIndex(
        (mem) => mem.userId.toString() === req.user._id.toString()
      );

      if (memberIdx !== -1) {
        team.members[memberIdx].isAcceptedInvite = true;
        team.invitations.splice(invitationIndex, 1);
        await team.save();
        invitationAccepted = true;
        break; // Accept only the first valid invitation
      }
    }

    if (!invitationAccepted) {
      return next(new ErrorResponse("No matching invitation found in teams", 404));
    }

    return sendSuccess(res, null, "Team invitation accepted successfully");
  } catch (error) {
    console.error("Error while accepting invitation:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});







module.exports = {
  createTeam,
  getTeam,
  getMyTeams,
  deleteTeam,
  updateTeam,
  addTeamMember,
  getTeamMembers,
  getTeamMemberById,
  removeTeamMember,
  updateTeamMember,
  acceptTeamInvitation,
}