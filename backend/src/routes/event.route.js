const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEventsFromTeam,
  getAllUserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  respondToEvent
} = require("../controllers/event.controller");
const upload = require("../middlewares/multer");
const { protect } = require("../middlewares/auth.middleware");

// Apply authentication middleware to all routes
router.use(protect);

// Event CRUD routes
router.post("/teams/:teamId/events", upload.array("files", 5), createEvent);
router.get("/teams/:teamId/events", getAllEventsFromTeam);
router.get("/events/my-events", getAllUserEvents);
router.get("/events/:eventId", getEventById);
router.put("/events/:eventId", upload.array("files", 5), updateEvent);
router.delete("/events/:eventId", deleteEvent);

// Event response routes
router.patch("/events/:eventId/respond", respondToEvent);

module.exports = router;