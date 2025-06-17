const express = require('express');
const { getTasks } = require('../controller/task.controller.js');
const router = express.Router();

// Task routes
router.get('/', getTasks);

module.exports = router;
