const connect = require("../db/db.js");
const Event = require("../models/Event.model.js");
const Team = require("../models/team.model.js");
const User = require("../models/User.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { uploadToImageKit, deleteFromImageKit } = require("../utils/imageKit.js");
const { extractImageKitFileId } = require("../utils/helpers.js");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse.js");

// Create a new event
const createEvent = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    location,
    eventDate,
    endDate,
    priority,
    attendees,
    isPublic,
    maxAttendees,
    tags,
    reminders
  } = req.body;
  const teamId = req.params.teamId;

  // Validate required fields
  if (!title || !description || !location || !eventDate || !teamId) {
    return next(new ErrorResponse("Title, description, location, event date, and team ID are required", 400));
  }

  // Validate event date
  if (new Date(eventDate) < new Date()) {
    return next(new ErrorResponse("Event date cannot be in the past", 400));
  }

  // Validate end date if provided
  if (endDate && new Date(endDate) <= new Date(eventDate)) {
    return next(new ErrorResponse("End date must be after event date", 400));
  }



  try {
    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    // Check if event with same title exists in team
    const existingEvent = await Event.findOne({ title, teamId });
    if (existingEvent) {
      return next(new ErrorResponse("Event with this title already exists in the team", 400));
    }

    // Process file uploads if any
    let uploads = [];
    if (req.files && req.files.length > 0) {
      uploads = await Promise.all(
        req.files.map(async (file) => {
          return await uploadToImageKit(file);
        })
      );
    }

    // Validate attendees if provided
    let processedAttendees = [];
    if (attendees && attendees.length > 0) {
      // Verify team members
      const teamMemberIds = team.members.map(member => member.userId?._id.toString());

      const invalidAttendees = attendees.filter(userId =>
        !teamMemberIds.includes(userId.toString())
      );

      if (invalidAttendees.length > 0) {
        return next(new ErrorResponse(
          `The following users do not belong to this team: ${invalidAttendees.join(', ')}`,
          400
        ));
      }

      // Check max attendees limit
      if (maxAttendees && attendees.length > maxAttendees) {
        return next(new ErrorResponse(
          `Number of attendees (${attendees.length}) exceeds maximum limit (${maxAttendees})`,
          400
        ));
      }

      processedAttendees = attendees.map(userId => ({
        userId,
        status: 'invited'
      }));
    }

    // Create new event
    const event = new Event({
      teamId,
      title,
      description,
      location,
      eventDate,
      endDate,
      priority: priority || 'medium',
      attendees: processedAttendees,
      uploads,
      isPublic: isPublic || false,
      maxAttendees,
      tags: tags || [],
      reminders: reminders || [{ time: 30 }],
      createdBy: req.user._id
    });

    await event.save();

    // Notify invited attendees
    if (processedAttendees.length > 0) {
      try {
        const users = await User.find({ _id: { $in: attendees } });

        await Promise.all(users.map(async (user) => {
          user.notifications.push({
            message: `You have been invited to event: ${title}`,
            type: 'event',
          });
          await user.save();
          console.log(`Event invitation sent to ${user.email} for event: ${title}`);
        }));
      } catch (error) {
        console.error('Error sending event invitations:', error);
      }
    }

    const populatedEvent = await Event.findById(event._id)
      .populate('attendees.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar');

    sendSuccess(res, populatedEvent, "Event created successfully", 201);
  } catch (error) {
    console.error("Error while creating event:", error);
    return next(new ErrorResponse(error.message || 'Server Error', 500));
  }
});

// Get all events from a team
const getAllEventsFromTeam = asyncHandler(async (req, res, next) => {
  const teamId = req.params.teamId;
  const { status, upcoming, page = 1, limit = 10 } = req.query;

  try {


    // Check if team exists and user is member
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorResponse("Team not found", 404));
    }

    const isMember = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return next(new ErrorResponse("You are not a member of this team", 403));
    }

    // Build query
    let query = { teamId };

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.eventDate = { $gte: new Date() };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find(query)
      .populate('attendees.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .sort({ eventDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    sendSuccess(res, {
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, "Events fetched successfully");
  } catch (error) {
    console.error("Error while fetching events:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Get all events where user is invited/attending
const getAllUserEvents = asyncHandler(async (req, res, next) => {
  const { status, upcoming } = req.query;

  try {


    let query = { 'attendees.userId': req.user._id };

    if (status) {
      query['attendees.status'] = status;
    }

    if (upcoming === 'true') {
      query.eventDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('attendees.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('teamId', 'name')
      .sort({ eventDate: 1 });

    sendSuccess(res, { events }, "User events fetched successfully");
  } catch (error) {
    console.error("Error while fetching user events:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Get event by ID
const getEventById = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId;

  try {


    const event = await Event.findById(eventId)
      .populate('attendees.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar')
      .populate('teamId', 'name');

    if (!event) {
      return next(new ErrorResponse("Event not found", 404));
    }

    sendSuccess(res, event, "Event fetched successfully");
  } catch (error) {
    console.error("Error while fetching event:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Update event
const updateEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId;
  const {
    title,
    description,
    location,
    eventDate,
    endDate,
    priority,
    attendees,
    status,
    isPublic,
    maxAttendees,
    tags,
    removedUploads
  } = req.body;

  try {


    const event = await Event.findById(eventId);
    if (!event) {
      return next(new ErrorResponse("Event not found", 404));
    }

    // Check if user is creator or team admin
    const team = await Team.findById(event.teamId);
    const isCreator = event.createdBy.toString() === req.user._id.toString();
    const isAdmin = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isCreator && !isAdmin) {
      return next(new ErrorResponse("You are not authorized to update this event", 403));
    }

    // Validate event date
    if (eventDate && new Date(eventDate) < new Date()) {
      return next(new ErrorResponse("Event date cannot be in the past", 400));
    }

    // Validate end date
    if (endDate && eventDate && new Date(endDate) <= new Date(eventDate)) {
      return next(new ErrorResponse("End date must be after event date", 400));
    }

    // Handle file uploads/deletions
    if (removedUploads && removedUploads.length > 0) {
      await Promise.all(
        removedUploads.map(async (fileUrl) => {
          try {
            const fileId = extractImageKitFileId(fileUrl);
            await deleteFromImageKit(fileId);
          } catch (error) {
            console.error(`Error deleting file ${fileUrl}:`, error);
          }
        })
      );
      event.uploads = event.uploads.filter(upload => !removedUploads.includes(upload));
    }

    // Process new file uploads
    if (req.files && req.files.length > 0) {
      const newUploads = await Promise.all(
        req.files.map(async (file) => {
          return await uploadToImageKit(file);
        })
      );
      event.uploads = [...event.uploads, ...newUploads];
    }

    // Update attendees if provided
    if (attendees) {
      const teamMemberIds = team.members.map(member => member.userId?.toString());

      const invalidAttendees = attendees.filter(userId =>
        !teamMemberIds.includes(userId.toString())
      );

      if (invalidAttendees.length > 0) {
        return next(new ErrorResponse(
          `These users are not team members: ${invalidAttendees.join(', ')}`,
          400
        ));
      }

      if (maxAttendees && attendees.length > maxAttendees) {
        return next(new ErrorResponse(
          `Number of attendees exceeds maximum limit`,
          400
        ));
      }

      // Preserve existing attendee responses, add new invites
      const existingAttendees = event.attendees.map(a => a.userId.toString());
      const newAttendees = attendees.filter(id => !existingAttendees.includes(id.toString()));

      // Add new attendees as invited
      newAttendees.forEach(userId => {
        event.attendees.push({ userId, status: 'invited' });
      });

      // Remove attendees not in the new list
      event.attendees = event.attendees.filter(attendee =>
        attendees.includes(attendee.userId.toString())
      );
    }

    // Update other fields
    const updateFields = {
      title: title ?? event.title,
      description: description ?? event.description,
      location: location ?? event.location,
      eventDate: eventDate ?? event.eventDate,
      endDate: endDate ?? event.endDate,
      priority: priority ?? event.priority,
      status: status ?? event.status,
      isPublic: isPublic ?? event.isPublic,
      maxAttendees: maxAttendees ?? event.maxAttendees,
      tags: tags ?? event.tags
    };

    Object.assign(event, updateFields);
    await event.save();

    const updatedEvent = await Event.findById(eventId)
      .populate('attendees.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar');

    sendSuccess(res, updatedEvent, "Event updated successfully");
  } catch (error) {
    console.error("Error while updating event:", error);
    return next(new ErrorResponse(error.message || "Server error", 500));
  }
});

// Delete event
const deleteEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId;

  try {


    const event = await Event.findById(eventId);
    if (!event) {
      return next(new ErrorResponse("Event not found", 404));
    }

    // Check if user is creator or team admin
    const team = await Team.findById(event.teamId);
    const isCreator = event.createdBy.toString() === req.user._id.toString();
    const isAdmin = team.members.some(member =>
      member.userId?.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isCreator && !isAdmin) {
      return next(new ErrorResponse("You are not authorized to delete this event", 403));
    }

    // Delete associated uploads
    if (event.uploads && event.uploads.length > 0) {
      await Promise.all(
        event.uploads.map(async (fileUrl) => {
          try {
            const fileId = extractImageKitFileId(fileUrl);
            await deleteFromImageKit(fileId);
          } catch (error) {
            console.error(`Error deleting file ${fileUrl}:`, error);
          }
        })
      );
    }

    await Event.findByIdAndDelete(eventId);
    sendSuccess(res, {}, "Event deleted successfully");
  } catch (error) {
    console.error("Error while deleting event:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Respond to event invitation
const respondToEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId;
  const { status } = req.body;

  if (!['accepted', 'declined', 'maybe'].includes(status)) {
    return next(new ErrorResponse("Invalid response status", 400));
  }

  try {


    const event = await Event.findById(eventId);
    if (!event) {
      return next(new ErrorResponse("Event not found", 404));
    }

    const attendee = event.attendees.find(a =>
      a.userId.toString() === req.user._id.toString()
    );

    if (!attendee) {
      return next(new ErrorResponse("You are not invited to this event", 403));
    }

    attendee.status = status;
    attendee.respondedAt = new Date();

    await event.save();

    const updatedEvent = await Event.findById(eventId)
      .populate('attendees.userId', 'fullName username avatar')
      .populate('createdBy', 'fullName username avatar');

    sendSuccess(res, updatedEvent, `Event response updated to ${status}`);
  } catch (error) {
    console.error("Error while responding to event:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

module.exports = {
  createEvent,
  getAllEventsFromTeam,
  getAllUserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  respondToEvent
};