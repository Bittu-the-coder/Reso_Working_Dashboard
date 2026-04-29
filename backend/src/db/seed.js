const mongoose = require("mongoose");
const User = require("../models/user.model.js");
const Team = require("../models/team.model.js");
const Project = require("../models/project.model.js");
const Event = require("../models/event.model.js");
const Task = require("../models/task.model.js");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seedData = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database.");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await Event.deleteMany({});
    await Task.deleteMany({});

    // Create Demo User
    console.log("Creating demo user...");

    const demoUser = await User.create({
      username: "demouser",
      email: "demo@example.com",
      fullName: "Demo User",
      password: "password123",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demouser",
    });

    // Create Demo Team
    console.log("Creating demo team...");
    const demoTeam = await Team.create({
      name: "Research Team Alpha",
      description: "Primary research group for dashboard development.",
      ownerId: demoUser._id,
      createdBy: demoUser._id,
      department: "Research & Development",
      members: [
        {
          userId: demoUser._id,
          name: demoUser.fullName,
          email: demoUser.email,
          role: "admin",
          isAcceptedInvite: true,
        },
      ],
    });

    // Update user with team
    demoUser.teams.push({ teamId: demoTeam._id, role: "admin" });
    await demoUser.save();

    // Create Demo Project
    console.log("Creating demo project...");
    const demoProject = await Project.create({
      name: "Dashboard Redesign",
      description: "Modernizing the UI with Aceternity UI components.",
      teamId: demoTeam._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
      priority: "high",
      status: "active",
      createdBy: demoUser._id,
      members: [{ userId: demoUser._id, role: "manager" }],
    });

    // Create Demo Event
    console.log("Creating demo event...");
    await Event.create({
      title: "Weekly Sync Meeting",
      description: "Discuss project progress and blockers.",
      teamId: demoTeam._id,
      location: "Zoom",
      eventDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      priority: "medium",
      createdBy: demoUser._id,
      attendees: [{ userId: demoUser._id, status: "accepted" }],
    });

    // Create Demo Task
    console.log("Creating demo task...");
    await Task.create({
      title: "Implement Aceternity Cards",
      description: "Replace legacy cards with GlowingCard component.",
      teamId: demoTeam._id,
      projectId: demoProject._id,
      status: "todo",
      priority: "high",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: demoUser._id,
      assignedTo: [demoUser._id],
    });

    console.log("Seeding completed successfully!");
    console.log("Demo Credentials:");
    console.log("Email: demo@example.com");
    console.log("Password: password123");
    console.log("Team ID:", demoTeam._id.toString());

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
