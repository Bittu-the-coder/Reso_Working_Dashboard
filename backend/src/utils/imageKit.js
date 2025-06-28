const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Function to upload files
const uploadToImageKit = async (file) => {
  try {
    const response = await imagekit.upload({
      file: file.buffer.toString("base64"), // Convert file buffer to base64
      fileName: file.originalname, // Original file name
      folder: "/task_uploads", // Optional folder organization
      useUniqueFileName: true // Ensure unique filenames
    });
    return response.url; // Return the URL of the uploaded file
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload file to ImageKit");
  }
};

// Function to delete files (optional)
const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw new Error("Failed to delete file from ImageKit");
  }
};

module.exports = { uploadToImageKit, deleteFromImageKit };