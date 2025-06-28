const connect = require("../db/db");
const Task = require("../models/Task.model");
const Team = require("../models/team.model");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");
const { extractImageKitFileId, arraysEqual, notifyAssignedUsers } = require("../utils/helpers");
const { uploadToImageKit, deleteFromImageKit } = require("../utils/imageKit");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse");

const createTasks = asyncHandler(async (req, res, next) => {
  const { title, description, dueDate, priority, assignedTo, steps } = req.body;
  const teamId = req.params.teamId;

  // Validate required fields
  if (!title || !teamId) {
    return next(new ErrorResponse("Title and team ID are required", 400));
  }

  try {
    // Check if task already exists
    const existingTask = await Task.findOne({ title, teamId });
    if (existingTask) {
      return next(new ErrorResponse("Task already exists", 400));
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
    const team = await Team.findById(teamId);

    // Check if assigned users exist in the team or not
    if (assignedTo && assignedTo.length > 0) {
      // Verify the team exists and has members
      if (!team || !team.members) {
        return next(new ErrorResponse("Team not found or has no members", 404));
      }

      // Convert team members to string IDs for comparison
      const teamMemberIds = team.members.map(member => member.userId?._id.toString());

      // Find which assigned users don't exist in the team
      const invalidUsers = assignedTo.filter(userId =>
        !teamMemberIds.includes(userId.toString())
      );

      if (invalidUsers.length > 0) {
        return next(new ErrorResponse(
          `The following users do not belong to this team: ${invalidUsers.join(', ')}`,
          400
        ));
      }
    }

    // Notify assigned users that they've been assigned to a task
    if (assignedTo && assignedTo.length > 0) {
      try {
        const users = await User.find({ _id: { $in: assignedTo } });

        // Use Promise.all for parallel processing
        await Promise.all(users.map(async (user) => {
          user.notifications.push({
            message: `You have been assigned a new task: ${title}`,
            type: 'task',
          });

          await user.save();
          console.log(`Notification sent to ${user.email} for task: ${title}`);
        }));

      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    }

    // Create new task
    const task = new Task({
      teamId,
      title,
      description,
      dueDate,
      priority: priority || 'low',
      assignedTo: assignedTo || [],
      steps: steps || [],
      uploads,
      status: 'todo', // Default status
      createdBy: req.user._id
    });

    await task.save();
    sendSuccess(res, task, "Task created successfully", 201);
  } catch (error) {
    console.error("Error while creating task:", error);
    return next(new ErrorResponse(error.message || 'Server Error', 500));
  }
});

const getAllTasksFromTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.teamId;
  try {

    const checkMember = await Team.findById(teamId).populate('members.userId', 'fullName username avatar');
    if (!checkMember) {
      return next(new ErrorResponse("Team not found", 404));
    }
    const tasks = await Task.find({ teamId });
    sendSuccess(res, { tasks }, "Tasks fetched successfully");
  } catch (error) {
    console.error("Error while fetching tasks:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// get all the tasks in which user is involved irrespective of team
const getAllTeamsTasks = asyncHandler(async (req, res, next) => {
  try {

    const tasks = await Task.find({ assignedTo: req.user._id });
    sendSuccess(res, { tasks }, "Tasks fetched successfully");
  } catch (error) {
    console.error("Error while fetching tasks:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getTaskById = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  try {

    const task = await Task.findOne({ _id: taskId });
    sendSuccess(res, task, "Task is fetched");
  } catch (error) {
    console.error("Error while fetching task:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const updateTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { title, description, dueDate, priority, assignedTo, steps, removedUploads } = req.body;

  try {

    const task = await Task.findById(taskId);
    const team = await Team.findById(task.teamId);

    if (!task) {
      return next(new ErrorResponse("Task not found", 404));
    }

    const originalTask = await Task.findById(taskId);
    task._original = originalTask;

    // Validate assigned users if being updated
    if (assignedTo && assignedTo.length > 0) {
      // First check if users exist
      const users = await User.find({ _id: { $in: assignedTo } });
      if (users.length !== assignedTo.length) {
        return next(new ErrorResponse("Some assigned users do not exist", 400));
      }

      // Then verify they belong to the team
      if (!team.members) {
        return next(new ErrorResponse("Team has no members", 400));
      }

      const teamMemberIds = team.members.map(member => member.userId?.toString());
      const invalidUsers = assignedTo.filter(userId =>
        !teamMemberIds.includes(userId.toString())
      );

      if (invalidUsers.length > 0) {
        return next(new ErrorResponse(
          `These users are not team members: ${invalidUsers.join(', ')}`,
          400
        ));
      }
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
      // Filter out removed uploads
      task.uploads = task.uploads.filter(upload => !removedUploads.includes(upload));
    }

    // Process new file uploads
    if (req.files && req.files.length > 0) {
      const newUploads = await Promise.all(
        req.files.map(async (file) => {
          return await uploadToImageKit(file);
        })
      );
      task.uploads = [...task.uploads, ...newUploads];
    }

    // Update task fields
    const updateFields = {
      title: title ?? task.title,
      description: description ?? task.description,
      dueDate: dueDate ?? task.dueDate,
      priority: priority ?? task.priority,
      assignedTo: assignedTo ?? task.assignedTo,
      steps: steps ?? task.steps,
      updatedAt: new Date()
    };

    // Apply updates
    Object.assign(task, updateFields);
    const updatedTask = await task.save();

    if (assignedTo && !arraysEqual(assignedTo, originalTask.assignedTo)) {
      await notifyAssignedUsers(updatedTask);
    }

    sendSuccess(res, updatedTask, "Task updated successfully");
  } catch (error) {
    console.error("Error while updating task:", error);
    return next(new ErrorResponse(error.message || "Server error", 500));
  }
});

const removeTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  try {

    const checkOwner = await Task.findById(taskId).populate('createdBy', 'fullName username');
    if (checkOwner.createdBy._id.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("You are not authorized to delete this task", 403));
    }
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return next(new ErrorResponse("Task not found", 404));
    }
    sendSuccess(res, {}, "Task deleted successfully");
  } catch (error) {
    console.error("Error while deleting task:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const addMessageToSpecificTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { message } = req.body;

  try {

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new ErrorResponse("Task not found", 404));
    }

    task.messages.push({
      sender: req.user._id,
      message,
      timestamp: new Date(),
    });

    await task.save();
    sendSuccess(res, task, "Message added to task");
  } catch (error) {
    console.error("Error while adding message to task:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getMessagesFromSpecificTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  try {

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new ErrorResponse("Task not found", 404));
    }
    sendSuccess(res, task.messages, "Messages fetched from task");
  } catch (error) {
    console.error("Error while fetching messages from task:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const updateMessageInSpecificTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  const messageId = req.params.messageId;
  const { message } = req.body;

  try {

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new ErrorResponse("Task not found", 404));
    }

    const isSender = task.messages.find((msg) => msg.sender._id.toString() === req.user._id.toString());
    if (!isSender) {
      return next(new ErrorResponse("You are not authorized to update this message", 403));
    }

    const messageToUpdate = task.messages.find((msg) => msg._id.toString() === messageId);
    if (!messageToUpdate) {
      return next(new ErrorResponse("Message not found", 404));
    }
    messageToUpdate.sender = req.user._id;
    messageToUpdate.message = message;
    messageToUpdate.timestamp = new Date();
    await task.save();
    sendSuccess(res, task, "Message updated in task");
  } catch (error) {
    console.error("Error while updating message in task:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const deleteMessageInSpecificTask = asyncHandler(async (req, res, next) => {
  const { teamId, taskId, messageId } = req.params;

  try {


    const task = await Task.findOne({ _id: taskId, teamId });
    if (!task) {
      return next(new ErrorResponse("Task not found in this team", 404));
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    const messageToDelete = task.messages.id(messageId);
    if (!messageToDelete) {
      return next(new ErrorResponse("Message not found", 404));
    }

    const isSender = messageToDelete.sender._id.toString() === req.user._id.toString();
    const isAdmin = team.members.some(mem =>
      mem.userId.toString() === req.user._id.toString() && mem.role === 'admin'
    );

    if (!isSender && !isAdmin) {
      return next(new ErrorResponse("Unauthorized to delete this message", 403));
    }

    task.messages.pull(messageToDelete);
    await task.save();

    sendSuccess(res, null, "Message deleted successfully", 200);
  } catch (error) {
    console.error("Error deleting message:", error);
    return next(new ErrorResponse(error.message || "Server error", 500));
  }
});

const updateTaskStatus = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { status, steps } = req.body;

  try {

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new ErrorResponse("Task not found", 404));
    }

    if (task.status === status) {
      return next(new ErrorResponse("Task status is already updated", 400));
    }
    if (status) task.status = status;
    // get steps and make isCompleted true update reported by user
    if (steps) {
      steps.forEach((step) => {
        const taskStep = task.steps.id(step._id);
        if (taskStep) {
          taskStep.isCompleted = step.isCompleted;
          taskStep.reportedBy = req.user._id;
        }
      });
    }
    await task.save();
    sendSuccess(res, task, "Task status updated");
  } catch (error) {
    console.error("Error while updating task status:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

module.exports = {
  createTasks,
  getAllTasksFromTeam,
  getAllTeamsTasks,
  removeTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  addMessageToSpecificTask,
  getMessagesFromSpecificTask,
  updateMessageInSpecificTask,
  deleteMessageInSpecificTask
}