import express from 'express';
import userRoutes from '../../modules/user/user.routes.js';
import postRoutes from '../../modules/post/post.routes.js';
import uploadRoutes from '../../modules/upload/upload.routes.js';

const router = express.Router();

/**
 * API v1 Routes
 */

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'CraftBook API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// Mount module routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);

export default router;
