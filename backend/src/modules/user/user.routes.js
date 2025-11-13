import express from 'express';
import userController from './user.controller.js';

const router = express.Router();

/**
 * User Routes
 */

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/google/:googleId - Get user by Google ID
router.get('/google/:googleId', userController.getUserByGoogleId);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// POST /api/users - Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

export default router;
