
const Docs = require("../modals/Docs.modal");
const asyncHandler = require("../utils/asyncHandler");

const addDocs = asyncHandler(async (req, res) => {
  const { title, url } = req.body;

  // First check if document with the URL already exists
  const existingDoc = await Docs.findOne({ url });
  if (existingDoc) {
    return res.status(400).json({
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
    data: newDoc
  });
});


const getDocs = asyncHandler(async (req, res) => {
  const docs = await Docs.find({}).select('title url addedOn _id').lean();

  // Transform the MongoDB _id to id for frontend compatibility
  const formattedDocs = docs.map(doc => ({
    id: doc._id,
    title: doc.title,
    url: doc.url,
    addedOn: doc.addedOn
  }));

  res.status(200).json({
    success: true,
    data: formattedDocs
  });
});

const updateDocs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;

  const updatedDoc = await Docs.findByIdAndUpdate(
    id,
    { title, url },
    { new: true }
  );

  if (!updatedDoc) {
    return res.status(404).json({
      success: false,
      message: "Document not found"
    });
  }

  res.status(200).json({
    success: true,
    data: {
      id: updatedDoc._id,
      title: updatedDoc.title,
      url: updatedDoc.url,
      addedOn: updatedDoc.addedOn
    }
  });
});

const deleteDocs = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDoc = await Docs.findByIdAndDelete(id);

  if (!deletedDoc) {
    return res.status(404).json({
      success: false,
      message: "Document not found"
    });
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