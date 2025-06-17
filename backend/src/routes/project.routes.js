const express = require('express');
const { getProjects } = require('../controller/project.controller.js');
const router = express.Router();

// Project routes
router.get('/', getProjects);

module.exports = router;
