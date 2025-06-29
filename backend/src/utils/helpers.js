const Task = require("../models/Task.model");
const User = require("../models/User.model");

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

module.exports = { arraysEqual, notifyAssignedUsers };