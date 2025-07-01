const Task = require("../models/Task.model");
const Team = require("../models/team.model");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");
const { arraysEqual, notifyAssignedUsers } = require("../utils/helpers");
const { uploadToImageKit, deleteFromImageKit } = require("../utils/imageKit");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse");

const createTasks = asyncHandler(async (req, res, next) => {
    const { title, description, dueDate, priority, assignedTo, steps } =
        req.body;
    const teamId = req.params.teamId;

    console.log("Creating task with data:", {
        title,
        description,
        dueDate,
        priority,
        assignedTo,
        steps,
        teamId,
    });

    // Validate required fields
    if (!title || !teamId) {
        return next(new ErrorResponse("Title and team ID are required", 400));
    }

    // Parse steps if it's a string
    let parsedSteps = [];
    try {
        parsedSteps =
            typeof steps === "string" ? JSON.parse(steps) : steps || [];
    } catch (error) {
        console.error("Error parsing steps:", error);
        return next(new ErrorResponse("Invalid steps format", 400));
    }

    console.log("Creating task with data:", {
        title,
        description,
        dueDate,
        priority,
        assignedTo,
        steps: parsedSteps,
        teamId,
    });
    try {
        // Check if task already exists
        const existingTask = await Task.findOne({ title, teamId });
        if (existingTask) {
            return next(new ErrorResponse("Task already exists", 400));
        }
        const team = await Team.findById(teamId);

        // // check if you are admin or not
        // const user = await User.findById(req.user._id);
        // if(user._id !== team.members.userId._id) {
        //   return next(new ErrorResponse("You are not admin"))
        // }

        let uploads = [];

        if (req.files && req.files.length > 0) {
            uploads = await Promise.all(
                req.files.map(async (file) => {
                    const response = await uploadToImageKit(file);
                    return {
                        url: response.url,
                        fileId: response.fileId,
                        name: response.name,
                        size: response.size,
                        fileType: response.fileType,
                    };
                })
            );
        }
        console.log("Uploads processed:", uploads);

        // Check if assigned users exist in the team or not
        if (assignedTo && assignedTo.length > 0) {
            // Verify the team exists and has members
            if (!team || !team.members) {
                return next(
                    new ErrorResponse("Team not found or has no members", 404)
                );
            }

            // Convert team members to string IDs for comparison
            const teamMemberIds = team.members.map((member) =>
                member.userId?._id.toString()
            );

            // Find which assigned users don't exist in the team
            const invalidUsers = assignedTo.filter(
                (userId) => !teamMemberIds.includes(userId.toString())
            );

            if (invalidUsers.length > 0) {
                return next(
                    new ErrorResponse(
                        `The following users do not belong to this team: ${invalidUsers.join(
                            ", "
                        )}`,
                        400
                    )
                );
            }
        }

        // Notify assigned users that they've been assigned to a task
        if (assignedTo && assignedTo.length > 0) {
            try {
                const users = await User.find({ _id: { $in: assignedTo } });

                // Use Promise.all for parallel processing
                await Promise.all(
                    users.map(async (user) => {
                        user.notifications.push({
                            message: `You have been assigned a new task: ${title}`,
                            type: "task",
                        });

                        await user.save();

                        //lets notify the user by email
                        await notifyUserByEmail(
                            user.id,
                            "New Task Assigned",
                            `You have been assigned a new task: <strong>${title}</strong><br>
                            Description: ${description || "No description provided"}<br>
                            Due Date: ${dueDate || "No due date set"}<br>
                            Priority: ${priority || "Low"}`
                        );
                        console.log(
                            `Notification sent to ${user.email} for task: ${title}`
                        );
                    })
                );
            } catch (error) {
                console.error("Error sending notifications:", error);
            }
        }

        // Create new task
        const task = new Task({
            teamId,
            title,
            description,
            dueDate,
            priority: priority || "low",
            assignedTo: assignedTo || [],
            steps: parsedSteps || [],
            uploads,
            status: "todo", // Default status
            createdBy: req.user._id,
        });

        await task.save();
        sendSuccess(res, task, "Task created successfully", 201);
    } catch (error) {
        console.error("Error while creating task:", error);
        return next(new ErrorResponse(error.message || "Server Error", 500));
    }
});

const getAllTasksFromTeam = asyncHandler(async (req, res, next) => {
    const teamId = req.params.teamId;
    try {
        const checkMember = await Team.findById(teamId).populate(
            "members.userId",
            "fullName username avatar"
        );
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
    const teamId = req.params.teamId;

    try {
        // Validate taskId
        if (!taskId) {
            return next(new ErrorResponse("Task ID is required", 400));
        }

        // Find task and populate necessary fields
        const task = await Task.findById(taskId)
            .populate("assignedTo", "fullName username avatar")
            .populate("createdBy", "fullName username avatar")
            .populate("teamId", "name");

        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        // Check if user has access to the task
        const team = await Team.findById(task.teamId);
        if (!team) {
            return next(new ErrorResponse("Associated team not found", 404));
        }

        const isMember = team.members.some(
            (member) => member.userId?.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return next(
                new ErrorResponse("You don't have access to this task", 403)
            );
        }

        sendSuccess(res, task, "Task fetched successfully");
    } catch (error) {
        console.error("Error while fetching task:", error);
        return next(new ErrorResponse("Server error", 500));
    }
});

const updateTask = asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId;

    try {
        // Parse the incoming data
        const {
            title,
            description,
            dueDate,
            priority,
            assignedTo = [],
            steps = [],
            removedUploads = [],
        } = req.body;
        console.log("Update task with data:", {
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            steps,
            removedUploads,
        });

        const task = await Task.findById(taskId);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }
        // Handle new file uploads
        if (req.files && req.files.length > 0) {
            const newUploads = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const uploadResponse = await uploadToImageKit(file);
                        return {
                            url: uploadResponse.url,
                            fileId: uploadResponse.fileId,
                            name: uploadResponse.name,
                            size: uploadResponse.size,
                            fileType: uploadResponse.fileType,
                        };
                    } catch (error) {
                        console.error("Error uploading file:", error);
                        return null;
                    }
                })
            );

            // Filter out failed uploads and add to task
            const successfulUploads = newUploads.filter((u) => u.url !== null);
            task.uploads = [...task.uploads, ...successfulUploads];
        }

        // Handle removed uploads
        if (removedUploads && removedUploads.length > 0) {
            const parsedRemovedUploads = Array.isArray(removedUploads)
                ? removedUploads
                : JSON.parse(removedUploads);

            // Filter out null values
            const validRemovedUploads = parsedRemovedUploads.filter(
                (url) => url !== null
            );
            console.log("Valid removed uploads:", validRemovedUploads);

            await Promise.all(
                validRemovedUploads.map(async (fileUrl) => {
                    try {
                        const fileId = await task.uploads.find(
                            (upload) => upload.url === fileUrl
                        )?.fileId;
                        if (fileId) await deleteFromImageKit(fileId);
                    } catch (error) {
                        console.error(`Error deleting file ${fileUrl}:`, error);
                    }
                })
            );

            // Update task uploads by filtering out removed ones
            task.uploads = task.uploads.filter(
                (upload) => !validRemovedUploads.includes(upload.url)
            );
        }

        // Update other task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.updatedAt = new Date();

        // Handle assignedTo
        if (assignedTo) {
            const parsedAssignedTo = Array.isArray(assignedTo)
                ? assignedTo
                : JSON.parse(assignedTo);
            task.assignedTo = parsedAssignedTo;
        }

        // Handle steps
        if (steps) {
            const parsedSteps = Array.isArray(steps)
                ? steps
                : JSON.parse(steps);
            task.steps = parsedSteps;
        }

        // Save the updated task
        const updatedTask = await task.save();

        sendSuccess(res, updatedTask, "Task updated successfully");
    } catch (error) {
        console.error("Error while updating task:", error);
        return next(new ErrorResponse(error.message || "Server error", 500));
    }
});

const removeTask = asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId;
    try {
        const checkOwner = await Task.findById(taskId).populate(
            "createdBy",
            "fullName username"
        );
        if (checkOwner.createdBy._id.toString() !== req.user._id.toString()) {
            return next(
                new ErrorResponse(
                    "You are not authorized to delete this task",
                    403
                )
            );
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

        const isSender = task.messages.find(
            (msg) => msg.sender._id.toString() === req.user._id.toString()
        );
        if (!isSender) {
            return next(
                new ErrorResponse(
                    "You are not authorized to update this message",
                    403
                )
            );
        }

        const messageToUpdate = task.messages.find(
            (msg) => msg._id.toString() === messageId
        );
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
        console.log("team message: ", teamId, taskId, messageId);
        const task = await Task.findOne({ _id: taskId });
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

        const isSender =
            messageToDelete.sender._id.toString() === req.user._id.toString();
        const isAdmin = team.members.some(
            (mem) =>
                mem.userId.toString() === req.user._id.toString() &&
                mem.role === "admin"
        );

        if (!isSender && !isAdmin) {
            return next(
                new ErrorResponse("Unauthorized to delete this message", 403)
            );
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
    const { status, stepId, completed } = req.body;

    try {
        console.log("Updating task status:", {
            taskId,
            status,
            stepId,
            completed,
        });

        const task = await Task.findById(taskId);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        if (status) task.status = status;
        // get steps and make isCompleted true update reported by user
        if (stepId && completed !== undefined) {
            const step = task.steps.find((s) => s._id.toString() === stepId);
            if (!step) {
                return next(new ErrorResponse("Step not found", 404));
            }
            step.isCompleted = completed;
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
    deleteMessageInSpecificTask,
};
