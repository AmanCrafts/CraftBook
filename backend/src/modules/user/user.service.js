import userRepository from './user.repository.js';

/**
 * User Service - Business Logic Layer
 * Contains all business logic for user operations
 */

/**
 * Create a new user
 */
export async function createUser(userData) {
    const { googleId, email, name, bio, profilePicture, medium } = userData;

    // Validation
    if (!email || !name) {
        throw new Error('Email and name are required');
    }

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Create user
    return await userRepository.create({
        googleId,
        email,
        name,
        bio,
        profilePicture,
        medium,
    });
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

/**
 * Get user by Google ID
 */
export async function getUserByGoogleId(googleId) {
    const user = await userRepository.findByGoogleId(googleId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

/**
 * Get all users
 */
export async function getAllUsers() {
    return await userRepository.findAll();
}

/**
 * Update user
 */
export async function updateUser(id, userData) {
    // Check if user exists
    await getUserById(id);
    
    // Update user
    return await userRepository.update(id, userData);
}

/**
 * Delete user
 */
export async function deleteUser(id) {
    // Check if user exists
    await getUserById(id);
    
    // Delete user
    return await userRepository.delete(id);
}

// Default export for compatibility
export default {
    createUser,
    getUserById,
    getUserByGoogleId,
    getAllUsers,
    updateUser,
    deleteUser,
};
