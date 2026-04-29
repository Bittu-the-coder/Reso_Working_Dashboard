const connect = require("../db/db.js");
const Project = require("../models/project.model.js");
const Team = require("../models/team.model.js");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { uploadToImageKit, deleteFromImageKit } = require("../utils/imageKit.js");
const { extractImageKitFileId } = require("../utils/helpers.js");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse.js");

// Create a new project
const createProject = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    startDate,
    endDate,
    priority,
    members,
    milestones,
    budget,
    tags,
    repository,
    technologies,
    isPrivate
  } = req.body;
  const teamId = req.params.teamId;

  // Validate required fields
  if (!name || !description || !startDate || !endDate || !teamId) {
    return next(new ErrorResponse("Name, description, start date, end date, and team ID are required", 400));
  }

  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    return next(new ErrorResponse("End date must be after start date", 400));
  }



  try {
    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    // Check if user is team member
    const isMember = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return next(new ErrorResponse("You are not a member of this team", 403));
    }

    // Check if project with same name exists in team
    const existingProject = await Project.findOne({ name, teamId });
    if (existingProject) {
      return next(new ErrorResponse("Project with this name already exists in the team", 400));
    }

    // Process file uploads if any
    let uploads = [];
    if (req.files && req.files.length > 0) {
      uploads = await Promise.all(
        req.files.map(async (file) => {
          return await uploadToImageKit(file);
        })
      );
    }

    // Validate members if provided
    let processedMembers = [];
    if (members && members.length > 0) {
      // Verify team members
      const teamMemberIds = team.members.map(member => member.userId?._id.toString());

      const invalidMembers = members.filter(member =>
        !teamMemberIds.includes(member.userId?.toString() || member.toString())
      );

      if (invalidMembers.length > 0) {
        return next(new ErrorResponse(
          `Some users do not belong to this team`,
          400
        ));
      }

      processedMembers = members.map(member => {
        if (typeof member === 'string') {
          return { userId: member, role: 'contributor' };
        }
        return {
          userId: member.userId,
          role: member.role || 'contributor'
        };
      });
    }

    // Add creator as project manager if not already included
    const creatorInMembers = processedMembers.find(member =>
      member.userId.toString() === req.user._id.toString()
    );

    if (!creatorInMembers) {
      processedMembers.unshift({
        userId: req.user._id,
        role: 'manager'
      });
    }

    // Process milestones
    let processedMilestones = [];
    if (milestones && milestones.length > 0) {
      processedMilestones = milestones.map(milestone => ({
        title: milestone.title,
        description: milestone.description || '',
        dueDate: milestone.dueDate
      }));
    }

    // Create new project
    const project = new Project({
      teamId,
      name,
      description,
      startDate,
      endDate,
      priority: priority || 'medium',
      members: processedMembers,
      milestones: processedMilestones,
      budget: budget || { allocated: 0, spent: 0 },
      tags: tags || [],
      repository,
      technologies: technologies || [],
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      uploads,
      createdBy: req.user._id
    });

    await project.save();

    // Notify project members
    if (processedMembers.length > 1) {
      try {
        const memberIds = processedMembers
          .filter(member => member.userId.toString() !== req.user._id.toString())
          .map(member => member.userId);

        const users = await User.find({ _id: { $in: memberIds } });

        await Promise.all(users.map(async (user) => {
          user.notifications.push({
            message: `You have been added to project: ${name}`,
            type: 'project',
          });
          await user.save();
          console.log(`Project notification sent to ${user.email} for project: ${name}`);
        }));
      } catch (error) {
        console.error('Error sending project notifications:', error);
      }
    }

    const populatedProject = await Project.findById(project._id)
      .populate('members.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('milestones.completedBy', 'fullName username');

    sendSuccess(res, populatedProject, "Project created successfully", 201);
  } catch (error) {
    console.error("Error while creating project:", error);
    return next(new ErrorResponse(error.message || 'Server Error', 500));
  }
});

// Get all projects from a team
const getAllProjectsFromTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.teamId;
  const { status, priority, page = 1, limit = 10 } = req.query;

  try {


    // Check if team exists and user is member
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    const isMember = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return next(new ErrorResponse("You are not a member of this team", 403));
    }

    // Build query
    let query = { teamId };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
      .populate('members.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('milestones.completedBy', 'fullName username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    sendSuccess(res, {
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, "Projects fetched successfully");
  } catch (error) {
    console.error("Error while fetching projects:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Get all projects where user is a member
const getAllUserProjects = asyncHandler(async (req, res, next) => {
  const { status, role } = req.query;

  try {


    let query = {
      $or: [
        { 'members.userId': req.user._id },
        { createdBy: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (role) {
      query['members.role'] = role;
    }

    const projects = await Project.find(query)
      .populate('members.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('teamId', 'name')
      .sort({ updatedAt: -1 });

    sendSuccess(res, { projects }, "User projects fetched successfully");
  } catch (error) {
    console.error("Error while fetching user projects:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Get project by ID
const getProjectById = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;

  try {


    const project = await Project.findById(projectId)
      .populate('members.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('milestones.completedBy', 'fullName username')
      .populate('teamId', 'name');

    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Check if user has access to project
    const isMember = project.members.some(member =>
      member.userId._id.toString() === req.user._id.toString()
    );

    if (!isMember && project.isPrivate) {
      return next(new ErrorResponse("You do not have access to this project", 403));
    }

    sendSuccess(res, project, "Project fetched successfully");
  } catch (error) {
    console.error("Error while fetching project:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Update project
const updateProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const {
    name,
    description,
    startDate,
    endDate,
    priority,
    status,
    members,
    milestones,
    budget,
    progress,
    tags,
    repository,
    technologies,
    isPrivate,
    removedUploads
  } = req.body;

  try {


    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Check if user is project manager or team admin
    const team = await Team.findById(project.teamId);
    const isManager = project.members.some(member =>
      member.userId.toString() === req.user._id.toString() && member.role === 'manager'
    );
    const isTeamAdmin = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isManager && !isTeamAdmin) {
      return next(new ErrorResponse("You are not authorized to update this project", 403));
    }

    // Validate dates if provided
    const newStartDate = startDate ? new Date(startDate) : project.startDate;
    const newEndDate = endDate ? new Date(endDate) : project.endDate;

    if (newStartDate >= newEndDate) {
      return next(new ErrorResponse("End date must be after start date", 400));
    }

    // Handle file uploads/deletions
    if (removedUploads && removedUploads.length > 0) {
      await Promise.all(
        removedUploads.map(async (fileUrl) => {
          try {
            const fileId = extractImageKitFileId(fileUrl);
            await deleteFromImageKit(fileId);
          } catch (error) {
            console.error(`Error deleting file ${fileUrl}:`, error);
          }
        })
      );
      project.uploads = project.uploads.filter(upload => !removedUploads.includes(upload));
    }

    // Process new file uploads
    if (req.files && req.files.length > 0) {
      const newUploads = await Promise.all(
        req.files.map(async (file) => {
          return await uploadToImageKit(file);
        })
      );
      project.uploads = [...project.uploads, ...newUploads];
    }

    // Update members if provided
    if (members) {
      const teamMemberIds = team.members.map(member => member.userId?.toString());

      const invalidMembers = members.filter(member => {
        const userId = member.userId || member;
        return !teamMemberIds.includes(userId.toString());
      });

      if (invalidMembers.length > 0) {
        return next(new ErrorResponse("Some users are not team members", 400));
      }

      const processedMembers = members.map(member => {
        if (typeof member === 'string') {
          return { userId: member, role: 'contributor' };
        }
        return {
          userId: member.userId,
          role: member.role || 'contributor'
        };
      });

      // Ensure creator remains as manager
      const creatorInMembers = processedMembers.find(member =>
        member.userId.toString() === project.createdBy.toString()
      );

      if (!creatorInMembers) {
        processedMembers.unshift({
          userId: project.createdBy,
          role: 'manager'
        });
      }

      project.members = processedMembers;
    }

    // Update milestones if provided
    if (milestones) {
      project.milestones = milestones.map(milestone => {
        if (milestone._id) {
          // Existing milestone - preserve completion data
          const existingMilestone = project.milestones.id(milestone._id);
          return {
            ...existingMilestone.toObject(),
            title: milestone.title || existingMilestone.title,
            description: milestone.description !== undefined ? milestone.description : existingMilestone.description,
            dueDate: milestone.dueDate || existingMilestone.dueDate
          };
        } else {
          // New milestone
          return {
            title: milestone.title,
            description: milestone.description || '',
            dueDate: milestone.dueDate
          };
        }
      });
    }

    // Validate progress
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return next(new ErrorResponse("Progress must be between 0 and 100", 400));
    }

    // Update other fields
    const updateFields = {
      name: name ?? project.name,
      description: description ?? project.description,
      startDate: newStartDate,
      endDate: newEndDate,
      priority: priority ?? project.priority,
      status: status ?? project.status,
      budget: budget ?? project.budget,
      progress: progress ?? project.progress,
      tags: tags ?? project.tags,
      repository: repository ?? project.repository,
      technologies: technologies ?? project.technologies,
      isPrivate: isPrivate ?? project.isPrivate
    };

    Object.assign(project, updateFields);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('members.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('milestones.completedBy', 'fullName username');

    sendSuccess(res, updatedProject, "Project updated successfully");
  } catch (error) {
    console.error("Error while updating project:", error);
    return next(new ErrorResponse(error.message || "Server error", 500));
  }
});

// Delete project
const deleteProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;

  try {


    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Check if user is project creator or team admin
    const team = await Team.findById(project.teamId);
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isTeamAdmin = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isCreator && !isTeamAdmin) {
      return next(new ErrorResponse("You are not authorized to delete this project", 403));
    }

    // Delete associated uploads
    if (project.uploads && project.uploads.length > 0) {
      await Promise.all(
        project.uploads.map(async (fileUrl) => {
          try {
            const fileId = extractImageKitFileId(fileUrl);
            await deleteFromImageKit(fileId);
          } catch (error) {
            console.error(`Error deleting file ${fileUrl}:`, error);
          }
        })
      );
    }

    await Project.findByIdAndDelete(projectId);
    sendSuccess(res, {}, "Project deleted successfully");
  } catch (error) {
    console.error("Error while deleting project:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Update milestone status
const updateMilestoneStatus = asyncHandler(async (req, res, next) => {
  const { projectId, milestoneId } = req.params;
  const { isCompleted } = req.body;

  try {


    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Check if user is project member
    const isMember = project.members.some(member =>
      member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return next(new ErrorResponse("You are not a member of this project", 403));
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return next(new ErrorResponse("Milestone not found", 404));
    }

    milestone.isCompleted = isCompleted;
    if (isCompleted) {
      milestone.completedBy = req.user._id;
      milestone.completedAt = new Date();
    } else {
      milestone.completedBy = undefined;
      milestone.completedAt = undefined;
    }

    // Update project progress based on completed milestones
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter(m => m.isCompleted).length;

    if (totalMilestones > 0) {
      project.progress = Math.round((completedMilestones / totalMilestones) * 100);
    }

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('members.userId', 'fullName username avatar')
      .populate('milestones.completedBy', 'fullName username');

    sendSuccess(res, updatedProject, "Milestone status updated successfully");
  } catch (error) {
    console.error("Error while updating milestone:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Update project budget
const updateProjectBudget = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const { allocated, spent } = req.body;

  try {


    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Check if user is project manager or team admin
    const team = await Team.findById(project.teamId);
    const isManager = project.members.some(member =>
      member.userId.toString() === req.user._id.toString() && member.role === 'manager'
    );
    const isTeamAdmin = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isManager && !isTeamAdmin) {
      return next(new ErrorResponse("You are not authorized to update project budget", 403));
    }

    if (allocated !== undefined) {
      if (allocated < 0) {
        return next(new ErrorResponse("Allocated budget cannot be negative", 400));
      }
      project.budget.allocated = allocated;
    }

    if (spent !== undefined) {
      if (spent < 0) {
        return next(new ErrorResponse("Spent budget cannot be negative", 400));
      }
      project.budget.spent = spent;
    }

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('members.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar');

    sendSuccess(res, updatedProject, "Project budget updated successfully");
  } catch (error) {
    console.error("Error while updating project budget:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

module.exports = {
  createProject,
  getAllProjectsFromTeam,
  getAllUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMilestoneStatus,
  updateProjectBudget
};