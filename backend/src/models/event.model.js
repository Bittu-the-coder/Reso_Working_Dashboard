const mongoose = require('mongoose');

const AttendeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['invited', 'accepted', 'declined', 'maybe'],
    default: 'invited'
  },
  respondedAt: Date
});

const EventSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Team ID is required']
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  eventDate: {
    type: Date,
    required: [true, 'Please add an event date'],
  },
  endDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  attendees: [AttendeeSchema],
  uploads: [{
    type: String,
  }],
  reminders: [{
    time: {
      type: Number, // minutes before event
      default: 30
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  maxAttendees: {
    type: Number,
    default: null
  },
  tags: [String],
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
EventSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for event duration
EventSchema.virtual('duration').get(function () {
  if (this.endDate) {
    return this.endDate - this.eventDate;
  }
  return null;
});

// Index for efficient queries
EventSchema.index({ teamId: 1, eventDate: 1 });
EventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Event', EventSchema);