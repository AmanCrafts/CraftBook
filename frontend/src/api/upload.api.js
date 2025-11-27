import httpClient from "./httpClient";
import API_ENDPOINTS from "../constants/apiEndpoints";

// Upload API - all upload-related API calls

export const uploadAPI = {
  // Upload image
  uploadImage: async (imageUri) => {
    const formData = new FormData();

    // Get filename from URI
    const uriParts = imageUri.split("/");
    const fileName = uriParts[uriParts.length - 1];

    // Determine file type from extension
    const fileType = fileName.split(".").pop();
    const mimeType = `image/${fileType === "jpg" ? "jpeg" : fileType}`;

    // Append image with proper metadata for React Native
    formData.append("image", {
      uri: imageUri,
      type: mimeType,
      name: fileName,
    });

    return await httpClient.postFormData(API_ENDPOINTS.UPLOAD_IMAGE, formData);
  },

  // Delete image
  deleteImage: async (id) => {
    return await httpClient.delete(API_ENDPOINTS.DELETE_IMAGE(id));
  },
};

export default uploadAPI;
