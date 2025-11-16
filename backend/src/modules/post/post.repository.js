import { prisma } from '../../config/database.js';

/**
 * Post Repository - Data Access Layer
 * Handles all database operations for posts
 */

/**
 * Create a new post
 */
export async function create(postData) {
    return await prisma.post.create({
        data: postData,
        include: { author: true },
    });
}

/**
 * Find post by ID
 */
export async function findById(id) {
    return await prisma.post.findUnique({
        where: { id },
        include: { author: true },
    });
}

/**
 * Get all posts
 */
export async function findAll() {
    return await prisma.post.findMany({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Find posts by user ID
 */
export async function findByUserId(userId) {
    return await prisma.post.findMany({
        where: { authorId: userId },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Find posts by tag
 */
export async function findByTag(tag) {
    return await prisma.post.findMany({
        where: {
            tags: {
                has: tag,
            },
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Find posts by medium
 */
export async function findByMedium(medium) {
    return await prisma.post.findMany({
        where: { medium },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Find posts by tag and medium
 */
export async function findByTagAndMedium(tag, medium) {
    return await prisma.post.findMany({
        where: {
            tags: { has: tag },
            medium,
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Search posts by title
 */
export async function searchByTitle(title) {
    return await prisma.post.findMany({
        where: {
            title: {
                contains: title,
                mode: 'insensitive',
            },
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Search posts by description
 */
export async function searchByDescription(description) {
    return await prisma.post.findMany({
        where: {
            description: {
                contains: description,
                mode: 'insensitive',
            },
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Get recent posts
 */
export async function findRecent(limit = 10) {
    return await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { author: true },
    });
}

/**
 * Get popular posts (ordered by likes count)
 */
export async function findPopular(limit = 10) {
    return await prisma.post.findMany({
        take: limit,
        include: { 
            author: true,
            _count: {
                select: { likes: true, comments: true }
            }
        },
        orderBy: {
            likes: {
                _count: 'desc'
            }
        }
    });
}

/**
 * Get process posts
 */
export async function findProcessPosts() {
    return await prisma.post.findMany({
        where: { isProcessPost: true },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Update post
 */
export async function update(id, postData) {
    return await prisma.post.update({
        where: { id },
        data: postData,
        include: { author: true },
    });
}

/**
 * Delete post
 */
export async function deletePost(id) {
    return await prisma.post.delete({
        where: { id },
    });
}

// Default export for compatibility
export default {
    create,
    findById,
    findAll,
    findByUserId,
    findByTag,
    findByMedium,
    findByTagAndMedium,
    searchByTitle,
    searchByDescription,
    findRecent,
    findPopular,
    findProcessPosts,
    update,
    delete: deletePost,
};
