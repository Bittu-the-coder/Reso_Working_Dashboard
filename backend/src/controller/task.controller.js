const Task = require("../modals/task.modal");
const Team = require("../modals/team.modal");
const User = require("../modals/user.modal");
const asyncHandler = require("../utils/asyncHandler.js");
const ErrorResponse = require("../utils/ErrorResponse.js");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  let filter = {};

  // If teamId is provided, filter by team
  if (req.query.teamId) {
    const team = await Team.findById(req.query.teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    // Check if user is a team member
    if (!team.isMember(req.user._id)) {
      return next(new ErrorResponse("Not authorized to view team tasks", 403));
    }

    filter.teamId = req.query.teamId;
  } else {
    // Get tasks where user is creator, assigned, or team member
    const userTeams = await Team.find({
      "members.userId": req.user._id,
    }).select("_id");
    const teamIds = userTeams.map((team) => team._id);

    filter.$or = [
      { createdBy: req.user._id },
      { assignedTo: req.user._id },
      { teamId: { $in: teamIds } },
    ];
  }

  // Additional filters
  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  const tasks = await Task.find(filter)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .populate("teamId", "name")
    .populate("projectId", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email avatar")
    .populate("teamId", "name")
    .populate("projectId", "name");

  if (!task) {
    return next(new ErrorResponse("Task not found", 404));
  }

  // Check if user has access to this task
  let hasAccess = false;

  if (task.teamId) {
    const team = await Team.findById(task.teamId);
    hasAccess = team && team.isMember(req.user._id);
  } else {
    // For non-team tasks, check if user is creator or assignee
    hasAccess =
      task.createdBy._id.toString() === req.user._id.toString() ||
      task.assignedTo.some(
        (user) => user._id.toString() === req.user._id.toString()
      );
  }

  if (!hasAccess) {
    return next(new ErrorResponse("Not authorized to view this task", 403));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    dueDate,
    priority,
    projectId,
    teamId,
    assignedTo,
    tags,
    estimatedHours,
  } = req.body;

  if (!title) {
    return next(new ErrorResponse("Please provide a task title", 400));
  }

  // If teamId is provided, verify user is a team member
  if (teamId) {
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    if (!team.isMember(req.user._id)) {
      return next(
        new ErrorResponse("Not authorized to create tasks for this team", 403)
      );
    }

    // Verify assigned users are team members
    if (assignedTo && assignedTo.length > 0) {
      for (const userId of assignedTo) {
        if (!team.isMember(userId)) {
          return next(
            new ErrorResponse("Can only assign tasks to team members", 400)
          );
        }
      }
    }
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    projectId,
    teamId,
    createdBy: req.user._id,
    assignedTo: assignedTo || [],
    tags: tags || [],
    estimatedHours,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email avatar")
    .populate("teamId", "name")
    .populate("projectId", "name");

  res.status(201).json({
    success: true,
    data: populatedTask,
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse("Task not found", 404));
  }

  // Check if user has permission to update
  let canUpdate = false;

  if (task.teamId) {
    const team = await Team.findById(task.teamId);
    canUpdate =
      team &&
      (team.isAdminOrOwner(req.user._id) ||
        task.createdBy.toString() === req.user._id.toString() ||
        task.assignedTo.includes(req.user._id));
  } else {
    canUpdate = task.createdBy.toString() === req.user._id.toString();
  }

  if (!canUpdate) {
    return next(new ErrorResponse("Not authorized to update this task", 403));
  }

  // If updating assignedTo and task has team, verify assignees are team members
  if (req.body.assignedTo && task.teamId) {
    const team = await Team.findById(task.teamId);
    for (const userId of req.body.assignedTo) {
      if (!team.isMember(userId)) {
        return next(
          new ErrorResponse("Can only assign tasks to team members", 400)
        );
      }
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email avatar")
    .populate("teamId", "name")
    .populate("projectId", "name");

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse("Task not found", 404));
  }

  // Check if user has permission to delete
  let canDelete = false;

  if (task.teamId) {
    const team = await Team.findById(task.teamId);
    canDelete =
      team &&
      (team.isAdminOrOwner(req.user._id) ||
        task.createdBy.toString() === req.user._id.toString());
  } else {
    canDelete = task.createdBy.toString() === req.user._id.toString();
  }

  if (!canDelete) {
    return next(new ErrorResponse("Not authorized to delete this task", 403));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

// @desc    Get team tasks
// @route   GET /api/teams/:teamId/tasks
// @access  Private
exports.getTeamTasks = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  if (!team.isMember(req.user._id)) {
    return next(new ErrorResponse("Not authorized to view team tasks", 403));
  }

  let filter = { teamId };

  // Additional filters
  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  const tasks = await Task.find(filter)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email avatar")
    .populate("projectId", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Create team task
// @route   POST /api/teams/:teamId/tasks
// @access  Private
exports.createTeamTask = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  if (!team.isMember(req.user._id)) {
    return next(
      new ErrorResponse("Not authorized to create tasks for this team", 403)
    );
  }

  const {
    title,
    description,
    dueDate,
    priority,
    projectId,
    assignedTo,
    tags,
    estimatedHours,
  } = req.body;

  if (!title) {
    return next(new ErrorResponse("Please provide a task title", 400));
  }

  // Verify assigned users are team members
  if (assignedTo && assignedTo.length > 0) {
    for (const userId of assignedTo) {
      if (!team.isMember(userId)) {
        return next(
          new ErrorResponse("Can only assign tasks to team members", 400)
        );
      }
    }
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    projectId,
    teamId,
    createdBy: req.user._id,
    assignedTo: assignedTo || [],
    tags: tags || [],
    estimatedHours,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email avatar")
    .populate("projectId", "name");

  res.status(201).json({
    success: true,
    data: populatedTask,
  });
});
