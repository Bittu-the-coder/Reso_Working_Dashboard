const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProject,
  getAllProjectsFromTeam,
  getAllUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMilestoneStatus,
  updateProjectBudget
} = require("../controllers/project.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/multer.js");

// Apply authentication middleware to all routes
router.use(protect);

// Project CRUD routes
router.post("/teams/:teamId/projects", upload.array("files", 10), createProject);
router.get("/teams/:teamId/projects", getAllProjectsFromTeam);
router.get("/projects/my-projects", getAllUserProjects);
router.get("/projects/:projectId", getProjectById);
router.put("/projects/:projectId", upload.array("files", 10), updateProject);
router.delete("/projects/:projectId", deleteProject);

// Milestone management routes
router.patch("/projects/:projectId/milestones/:milestoneId", updateMilestoneStatus);

// Budget management routes
router.patch("/projects/:projectId/budget", updateProjectBudget);

module.exports = router;