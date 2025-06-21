// Ensure correct case sensitivity for file paths (important for Linux-based hosting)
const Docs = require("../modals/docs.modal.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ErrorResponse = require("../utils/ErrorResponse.js");

const addDocs = asyncHandler(async (req, res) => {
  const { title, url, department } = req.body;

  if (!title || !url || !department) {
    throw new ErrorResponse("Please provide title, URL and department", 400);
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    throw new ErrorResponse("Invalid URL format", 400);
  }

  // First check if document with the URL already exists
  const existingDoc = await Docs.findOne({ url });
  if (existingDoc) {
    return res.status(409).json({
      success: false,
      message: "Document with this URL already exists"
    });
  }

  const newDoc = await Docs.create({
    title,
    url,
    department
  });

  res.status(201).json({
    success: true,
    data: {
      id: newDoc._id,
      title: newDoc.title,
      url: newDoc.url,
      department: newDoc.department,
      addedOn: newDoc.addedOn
    }
  });
});

const getDocs = asyncHandler(async (req, res) => {
  const { department } = req.query;

  let query = {};
  if (department) {
    query.department = department;
  }

  const docs = await Docs.find(query).select('title url department addedOn _id').lean();

  const formattedDocs = docs.map(doc => ({
    id: doc._id.toString(),
    title: doc.title,
    url: doc.url,
    department: doc.department,
    addedOn: doc.addedOn
  }));

  res.status(200).json({
    success: true,
    count: formattedDocs.length,
    data: formattedDocs
  });
});

const updateDocs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, url, department } = req.body;

  if (!id) {
    throw new ErrorResponse("Document ID is required", 400);
  }

  if (!title || !url || !department) {
    throw new ErrorResponse("Please provide title, URL and department", 400);
  }

  const updatedDoc = await Docs.findByIdAndUpdate(
    id,
    { title, url, department },
    { new: true, runValidators: true }
  );

  if (!updatedDoc) {
    throw new ErrorResponse(`Document not found with id of ${id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: {
      id: updatedDoc._id.toString(),
      title: updatedDoc.title,
      url: updatedDoc.url,
      department: updatedDoc.department,
      addedOn: updatedDoc.addedOn
    }
  });
});

const deleteDocs = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ErrorResponse("Document ID is required", 400);
  }

  const deletedDoc = await Docs.findByIdAndDelete(id);

  if (!deletedDoc) {
    throw new ErrorResponse(`Document not found with id of ${id}`, 404);
  }

  res.status(200).json({
    success: true,
    message: "Document deleted successfully"
  });
});

module.exports = {
  addDocs,
  getDocs,
  updateDocs,
  deleteDocs
};