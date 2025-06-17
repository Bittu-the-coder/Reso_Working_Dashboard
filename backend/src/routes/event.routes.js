const express = require('express');
const { getEvents } = require('../controller/event.controller.js');
const router = express.Router();

// Event routes
router.get('/', getEvents);

module.exports = router;
