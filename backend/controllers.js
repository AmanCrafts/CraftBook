import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()


// Post Requests
export const createUser = async (req, res) => {
    const { googleId, email, name, bio, profilePicture, medium } = req.body;
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
        res.status(500).json({ error: 'Error creating user' });
    }
}

export const updateUser = async (req, res) => {
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

export const createPost = async (req, res) => {
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

export const getUserById = async (req, res) => {
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

