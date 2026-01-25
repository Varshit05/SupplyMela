// utils/cloudinaryUpload.js
import { cloudinary } from "../config/cloudinary.js";

export const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(buffer);
  });
};
export { uploadBuffer as uploadBufferToCloudinary };