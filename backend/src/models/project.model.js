const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true
  },
  description: String,
  dueDate: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: Date
});

const ProjectMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['manager', 'developer', 'designer', 'tester', 'contributor'],
    default: 'contributor'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const ProjectSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Team ID is required']
  },
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a project description']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    allocated: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    }
  },
  members: [ProjectMemberSchema],
  milestones: [MilestoneSchema],
  tags: [String],
  uploads: [{
    type: String,
  }],
  repository: {
    type: String, // Git repository URL
    trim: true
  },
  technologies: [String],
  isPrivate: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update updatedAt
ProjectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for project duration in days
ProjectSchema.virtual('durationInDays').get(function () {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for budget utilization percentage
ProjectSchema.virtual('budgetUtilization').get(function () {
  if (this.budget.allocated > 0) {
    return Math.round((this.budget.spent / this.budget.allocated) * 100);
  }
  return 0;
});

// Index for efficient queries
ProjectSchema.index({ teamId: 1, status: 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ 'members.userId': 1 });

module.exports = mongoose.model('Project', ProjectSchema);