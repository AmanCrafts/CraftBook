import { prisma } from '../../config/database.js';

/**
 * User Repository - Data Access Layer
 * Handles all database operations for users
 */

/**
 * Create a new user
 */
export async function create(userData) {
    return await prisma.user.create({
        data: userData,
    });
}

/**
 * Find user by ID
 */
export async function findById(id) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

/**
 * Find user by email
 */
export async function findByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

/**
 * Find user by Google ID
 */
export async function findByGoogleId(googleId) {
    return await prisma.user.findUnique({
        where: { googleId },
    });
}

/**
 * Get all users
 */
export async function findAll() {
    return await prisma.user.findMany();
}

/**
 * Update user
 */
export async function update(id, userData) {
    return await prisma.user.update({
        where: { id },
        data: userData,
    });
}

/**
 * Delete user
 */
export async function deleteUser(id) {
    return await prisma.user.delete({
        where: { id },
    });
}

// Default export for compatibility
export default {
    create,
    findById,
    findByEmail,
    findByGoogleId,
    findAll,
    update,
    delete: deleteUser,
};
