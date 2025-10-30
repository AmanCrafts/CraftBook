import { PrismaClient } from "./generated/prisma/index.js";
import { supabase } from "./lib/supabase.js";

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

// Update user details
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

// Create a new post
const createPost = async (req, res) => {
    const { title, description, imageUrl, tags, processStages, medium, authorId, isProcessPost = false } = req.body;
    
    if (!title || !imageUrl || !authorId) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: 'title, imageUrl, and authorId are required'
        });
    }
    
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
        console.error('Error creating post:', error);
        res.status(500).json({ 
            error: 'Error creating post',
            details: error.message 
        });
    }
};

// Get user by ID
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

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get post by ID
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

// Get all posts
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

// Get posts by user ID
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

// Delete user
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

// Delete post
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

// Search posts by tag
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

// Get all process posts
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

// Get posts by medium
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

// Get user by Google ID
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

// Search posts by title
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

// Search posts by description
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

// Get posts by tag and medium
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

// Get recent posts
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

// Get popular posts
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

// Upload image to Supabase Storage
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname}`;
        const bucketName = process.env.SUPABASE_BUCKET_NAME || 'Images';

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ error: 'Failed to upload image to storage', details: error.message });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        // Save the URL to database
        const image = await prisma.image.create({
            data: {
                name: file.originalname,
                url: publicUrl,
            },
        });

        res.status(200).json({ 
            success: true,
            image,
            message: 'Image uploaded successfully'
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Error uploading image', details: err.message });
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
    getPopularPosts,
    uploadImage
}

