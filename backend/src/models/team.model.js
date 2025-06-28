const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String, enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add a member name'],
  },
  email: {
    type: String,
    required: [true, 'Please add a member email'],
    trim: true
  },
  role: {
    type: String, enum: ['admin', 'member'],
    default: 'member'
  },
  department: {
    type: String,
  },
  isAcceptedInvite: {
    type: Boolean,
    default: false
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a team name'],
    trim: true,
    maxlength: [100, 'Team name cannot be more than 100 characters']
  },
  description: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [MemberSchema],
  invitations: [InvitationSchema],
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
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

TeamSchema.pre('findOneAndDelete', async function (next) {
  const teamId = this.getQuery()._id;

  try {
    // Correct model imports with proper paths
    const Task = mongoose.model('Task');
    const Event = mongoose.model('Event');
    const Project = mongoose.model('Project');
    const Document = mongoose.model('Document');
    const User = mongoose.model('User');

    // Remove team from users
    await User.updateMany(
      {},
      { $pull: { teams: teamId } }
    );

    // Delete all related entities
    await Task.deleteMany({ teamId });
    await Event.deleteMany({ teamId });
    await Project.deleteMany({ teamId });
    await Document.deleteMany({ teamId });

    next();
  } catch (error) {
    next(error);
  }
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team
