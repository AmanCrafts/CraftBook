import { useState } from "react";
import uploadAPI from "../api/upload.api";

// Handle image uploads
export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (imageUri) => {
    try {
      setUploading(true);
      setError(null);

      const result = await uploadAPI.uploadImage(imageUri);

      return result;
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      setError(null);
      await uploadAPI.deleteImage(imageId);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
      throw err;
    }
  };

  return { uploadImage, deleteImage, uploading, progress, error };
};
