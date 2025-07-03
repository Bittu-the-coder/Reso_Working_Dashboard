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
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder: "/task_uploads",
      useUniqueFileName: true
    });
    console.log("ImageKit upload response:", response);
    return response; // Return the URL of the uploaded file
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload file to ImageKit");
  }
};

// Function to delete files (optional)
const deleteFromImageKit = async (fileId) => {
  try {
    console.log("fileid", fileId);
    const response = await imagekit.deleteFile(fileId);
    console.log("ImageKit delete response:", response);
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw new Error("Failed to delete file from ImageKit");
  }
};

module.exports = { uploadToImageKit, deleteFromImageKit };