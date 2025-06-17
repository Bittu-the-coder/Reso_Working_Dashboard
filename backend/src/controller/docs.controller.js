const Docs = require("../modals/Docs.modal");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const addDocs = asyncHandler(async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    throw new ErrorResponse("Please provide title and URL", 400);
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
    url
  });

  res.status(201).json({
    success: true,
    data: {
      id: newDoc._id,
      title: newDoc.title,
      url: newDoc.url,
      addedOn: newDoc.addedOn
    }
  });
});


const getDocs = asyncHandler(async (req, res) => {
  const docs = await Docs.find({}).select('title url addedOn _id').lean();

  // Transform the MongoDB _id to id for frontend compatibility
  const formattedDocs = docs.map(doc => ({
    id: doc._id.toString(),
    title: doc.title,
    url: doc.url,
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
  const { title, url } = req.body;

  if (!id) {
    throw new ErrorResponse("Document ID is required", 400);
  }

  if (!title || !url) {
    throw new ErrorResponse("Please provide title and URL", 400);
  }

  const updatedDoc = await Docs.findByIdAndUpdate(
    id,
    { title, url },
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