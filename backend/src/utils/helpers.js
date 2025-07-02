const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

const notifyAssignedUsers = async (task) => {
  try {
    // Get current assigned users who should be notified
    const usersToNotify = await User.find({ _id: { $in: task.assignedTo } });

    // Get previous assigned users from the original task if available
    const originalTask = task._original ? task._original : await Task.findById(task._id);
    const previousAssigned = originalTask?.assignedTo || [];

    // Find newly assigned users (users in current assignment but not in previous)
    const newAssignments = task.assignedTo.filter(userId =>
      !previousAssigned.some(prevId => prevId.toString() === userId.toString())
    );

    // Only notify if there are new assignments
    if (newAssignments.length > 0) {
      const newlyAssignedUsers = usersToNotify.filter(user =>
        newAssignments.some(id => id.toString() === user._id.toString())
      );

      await Promise.all(newlyAssignedUsers.map(async (user) => {
        // Add notification
        user.notifications.push({
          message: `You've been assigned to task: ${task.title}`,
          type: 'task',
        });

        // Save user with new notification
        await user.save();

        console.log(`Notification sent to ${user.email} for task assignment: ${task.title}`);

        // Here you could add:
        // 1. Real-time notification via websockets
        // 2. Email notification
        // 3. Push notification
      }));
    }
  } catch (error) {
    console.error('Error notifying assigned users:', error);
  }
};

/**
 * Extract ImageKit fileId from a URL
 * This is a utility function to help with deleting files from ImageKit
 * @param {string} url - The ImageKit file URL
 * @returns {string} The extracted fileId or the original url if extraction fails
 */
const extractImageKitFileId = (url) => {
  try {
    if (!url) return null;

    // If the url already looks like a fileId, return it
    if (!url.includes('/') && !url.includes('.')) {
      return url;
    }

    // Extract the fileId from the URL path
    // Assumes the fileId is the last part of the path before query params
    const urlParts = url.split('?')[0].split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const fileId = fileNameWithExtension.split('.')[0];

    return fileId;
  } catch (error) {
    console.error("Error extracting ImageKit fileId:", error);
    // Return the original URL as fallback
    return url;
  }
};

module.exports = { arraysEqual, notifyAssignedUsers, extractImageKitFileId };