const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitedUserEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    message: {
      type: String,
      trim: true,
      maxlength: [200, "Message cannot be more than 200 characters"],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
inviteSchema.index({ invitedUserEmail: 1, status: 1 });
inviteSchema.index({ teamId: 1, status: 1 });
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if invite is expired
inviteSchema.methods.isExpired = function () {
  return Date.now() > this.expiresAt;
};

// Method to mark invite as expired
inviteSchema.methods.markAsExpired = function () {
  this.status = "expired";
  return this.save();
};

module.exports = mongoose.model("Invite", inviteSchema);
