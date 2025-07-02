const express = require('express');
const { createTasks, removeTask, getAllTasksFromTeam, getAllTeamsTasks, getTaskById, updateTask, updateTaskStatus, getMessagesFromSpecificTask, addMessageToSpecificTask, deleteMessageInSpecificTask, updateMessageInSpecificTask } = require('../controllers/task.controller.js');
const upload = require('../middlewares/multer.js');

const { protect } = require('../middlewares/auth.middleware.js');
const router = express.Router();

router.route('/teams/:teamId/tasks')
  .post(protect, upload.array('uploads'), createTasks)
  .get(protect, getAllTasksFromTeam);

router.route('/teamstasks')
  .get(protect, getAllTeamsTasks);

router.route('/teams/:teamId/tasks/:taskId')
  .get(protect, getTaskById)
  .put(protect, upload.array('uploads'), updateTask)
  .delete(protect, removeTask)
  .post(protect, updateTaskStatus);

router.route('/teams/:teamId/tasks/:taskId/messages')
  .get(protect, getMessagesFromSpecificTask)
  .post(protect, addMessageToSpecificTask);

router.route('/teams/:teamId/tasks/:taskId/messages/:messageId')
  .delete(protect, deleteMessageInSpecificTask)
  .put(protect, updateMessageInSpecificTask);

module.exports = router;