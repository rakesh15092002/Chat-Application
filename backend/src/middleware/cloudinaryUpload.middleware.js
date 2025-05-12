import cloudinary from "../lib/cloudinary.js";

export const uploadFilesToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(); // No files to upload
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) return reject(error);

            resolve({
              url: result.secure_url,
              name: file.originalname,
              type: file.mimetype,
              size: file.size.toString(),
              caption: req.body.text, // Optional, can be added by frontend or extended here
            });
          })
          .end(file.buffer);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    req.cloudinaryFiles = uploadedFiles; // Attach to req object for controller use

    next();
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
};
