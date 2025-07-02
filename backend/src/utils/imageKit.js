const ImageKit = require("imagekit");
require("dotenv").config();

// Add validation for ImageKit configuration
if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error('Missing required ImageKit configuration. Please check your environment variables.');
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Function to upload files
const uploadToImageKit = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file object provided to uploadToImageKit");
    }

    const response = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder: "/task_uploads",
      useUniqueFileName: true
    });

    return response;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error(`Failed to upload file to ImageKit: ${error.message}`);
  }
};

// Function to delete files (optional)
const deleteFromImageKit = async (fileId) => {
  try {
    if (!fileId) {
      console.warn("No fileId provided to deleteFromImageKit");
      return;
    }

    const response = await imagekit.deleteFile(fileId);
    return response;
  } catch (error) {
    console.error("ImageKit delete error:", error);
    console.warn(`Failed to delete file from ImageKit: ${error.message}`);
  }
};

module.exports = { uploadToImageKit, deleteFromImageKit };