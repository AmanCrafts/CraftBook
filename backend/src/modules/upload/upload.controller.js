import uploadService from './upload.service.js';

/**
 * Upload Controller - HTTP Request Handler
 * Handles file upload requests
 */

/**
 * Upload image
 * POST /api/upload
 */
export async function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await uploadService.uploadImage(req.file);
        res.status(200).json(result);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Error uploading image',
            details: error.message,
        });
    }
}

/**
 * Delete image
 * DELETE /api/upload/:id
 */
export async function deleteImage(req, res, next) {
    try {
        const { id } = req.params;
        const result = await uploadService.deleteImage(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete error:', error);
        res.status(error.message === 'Image not found' ? 404 : 500).json({
            error: 'Error deleting image',
            details: error.message,
        });
    }
}

// Default export for compatibility
export default {
    uploadImage,
    deleteImage,
};
