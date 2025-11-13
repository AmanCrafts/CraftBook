import httpClient from './httpClient';
import API_ENDPOINTS from '../constants/apiEndpoints';

// Upload API - all upload-related API calls

export const uploadAPI = {
  // Upload image
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await httpClient.postFormData(API_ENDPOINTS.UPLOAD_IMAGE, formData);
  },

  // Delete image
  deleteImage: async (id) => {
    return await httpClient.delete(API_ENDPOINTS.DELETE_IMAGE(id));
  },
};

export default uploadAPI;
