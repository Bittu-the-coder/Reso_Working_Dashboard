const connect = require("../db/db.js");
const Document = require("../models/document.model.js");
// Fix the User model import - ensure correct capitalization
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse.js");

const createDocument = asyncHandler(async (req, res, next) => {
  const { title, link, department } = req.body;
  const teamId = req.params.teamId;
  try {
    const existingDocument = await Document.findOne({
      title: title
    })
    if (existingDocument) {
      return next(new ErrorResponse("Document already exists", 400));
    }
    const document = await Document.create({
      teamId: teamId,
      title: title,
      link: link,
      department: department,
      uploadedBy: req.user._id
    });
    sendSuccess(res, document, "Document created successfully", 201);
  } catch (error) {
    console.log("Error while creating document:", error);
    return next(new ErrorResponse('Server Error', 500));
  }
})

const getAllDocument = asyncHandler(async (req, res, next) => {
  const teamId = req.params.teamId;
  try {

    const documents = await Document.find({ teamId: teamId });
    sendSuccess(res, { documents }, "Documents fetched successfully");
  } catch (error) {
    console.error("Error while fetching documents:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const getDocumentById = asyncHandler(async (req, res, next) => {
  const documentId = req.params.documentId;
  try {

    const document = await Document.findById(documentId);
    if (!document) {
      return next(new ErrorResponse("Document not found", 404));
    }
    sendSuccess(res, { document }, "Document fetched successfully", 200);
  } catch (error) {
    console.error("Error while fetching document:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const removeDocument = asyncHandler(async (req, res, next) => {
  const docId = req.params.documentId;
  if (!docId) {
    return next(new ErrorResponse("Document ID is required", 400));
  }
  try {
    const document = await Document.findById(docId);
    if (!document) {
      return next(new ErrorResponse("Document not found", 404));
    }
    await document.deleteOne();
    sendSuccess(res, docId, "Document removed successfully", 204);
  } catch (error) {
    console.log("Error While removing a doc", error);
    return next(new ErrorResponse("Server Error", 500));
  }
})

const updateDocument = asyncHandler(async (req, res, next) => {
  const docId = req.params.documentId;
  const { title, link, department, teamId } = req.body;
  try {
    const document = await Document.findByIdAndUpdate(
      docId,
      { title, link, department, teamId },
      { new: true }
    );
    if (!document) {
      return next(new ErrorResponse("Document not found", 404));
    }
    sendSuccess(res, document, "Document updated successfully");
  } catch (error) {
    console.error("Error while updating document:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

// Modified function to handle potential errors with team population
const getAllDocsIrrespectiveOfTeam = asyncHandler(async (req, res, next) => {
  try {
    // Safer implementation that handles potential User model issues
    let documents = [];

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Extract team IDs without requiring populate
    const teamIds = (user.teams || []).map(team =>
      typeof team === 'object' ? team.teamId : team
    ).filter(id => id); // Filter out any null/undefined values

    if (teamIds.length > 0) {
      documents = await Document.find({ teamId: { $in: teamIds } });
    }

    sendSuccess(res, { documents }, "Documents fetched successfully");
  } catch (error) {
    console.error("Error while fetching documents:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});


module.exports = {
  createDocument,
  getAllDocument,
  getDocumentById,
  removeDocument,
  updateDocument,
  getAllDocsIrrespectiveOfTeam,
}