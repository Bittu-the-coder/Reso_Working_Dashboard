const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a team name"],
      trim: true,
      maxlength: [100, "Team name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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
  },
  {
    timestamps: true,
  }
);

// Virtual to get member count
teamSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Method to check if user is a member
teamSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.userId.toString() === userId.toString()
  );
};

// Method to check if user is owner or admin
teamSchema.methods.isAdminOrOwner = function (userId) {
  const member = this.members.find(
    (member) => member.userId.toString() === userId.toString()
  );
  return member && (member.role === "owner" || member.role === "admin");
};

// Method to get user role in team
teamSchema.methods.getUserRole = function (userId) {
  const member = this.members.find(
    (member) => member.userId.toString() === userId.toString()
  );
  return member ? member.role : null;
};

module.exports = mongoose.model("Team", teamSchema);
