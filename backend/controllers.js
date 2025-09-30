import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();


const createUser = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }
    
    const { googleId, email, name, bio, profilePicture, medium } = req.body;
    

    if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
    }
    
    try {
        const newUser = await prisma.user.create({
            data: {
                googleId,
                email,
                name,
                bio,
                profilePicture,
                medium
            }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, name, bio, profilePicture, medium } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                name,
                bio,
                profilePicture,
                medium
            }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

const createPost = async (req, res) => {
    const { title, description, imageUrl, tags, processStages, medium, authorId, isProcessPost = false } = req.body;
    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                description,
                imageUrl,
                tags,
                processStages,
                medium,
                isProcessPost,
                author: { connect: { id: authorId } }
            }
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
};

// Get Requests

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: true }
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching post' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
}; 

const getPostsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: { authorId: userId },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts for user' });
    }
};

// Delete Requests

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
    }
};

// Additional Functionality

const searchPostsByTag = async (req, res) => {
    const { tag } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: {
                tags: {
                    has: tag
                }
            },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error searching posts by tag' });
    }
};

const getProcessPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { isProcessPost: true },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching process posts' });
    }
};

const getPostsByMedium = async (req, res) => {
    const { medium } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: { medium },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts by medium' });
    }
};

const getUserByGoogleId = async (req, res) => {
    const { googleId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { googleId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user by Google ID' });
    }
};

const getPostsByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error searching posts by title' });
    }
};

const getPostsByDescription = async (req, res) => {
    const { description } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: {
                description: {
                    contains: description,
                    mode: 'insensitive'
                }
            },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error searching posts by description' });
    }
};

const getPostsByTagAndMedium = async (req, res) => {
    const { tag, medium } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: {
                tags: {
                    has: tag
                },
                medium
            },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts by tag and medium' });
    }
};

const getRecentPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recent posts' });
    }
};

const getPopularPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { views: 'desc' },
            take: 10,
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching popular posts' });
    }
};

export const controllers = {
    createUser,
    updateUser,
    createPost,
    getUserById,
    getAllUsers,
    getPostById,
    getAllPosts,
    getPostsByUserId,
    deleteUser,
    deletePost,
    searchPostsByTag,
    getProcessPosts,
    getPostsByMedium,
    getUserByGoogleId,
    getPostsByTitle,
    getPostsByDescription,
    getPostsByTagAndMedium,
    getRecentPosts,
    getPopularPosts
}

