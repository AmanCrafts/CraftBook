import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import {controllers} from './controllers.js'

dotenv.config()
const app = express();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const PORT = 3000
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('The server is running.')
})

// User routes
app.get('/api/users', (req, res) => {
    controllers.getAllUsers(req, res)
});

app.get('/api/users/google/:googleId', (req, res) => {
    controllers.getUserByGoogleId(req, res)
});

app.post('/api/users', (req, res) => {
    controllers.createUser(req, res)
})

// Post routes
app.post('/api/posts', (req, res) => {
    controllers.createPost(req, res)
});

app.get('/api/posts', (req, res) => {
    controllers.getAllPosts(req, res)
});

app.get('/api/posts/recent', (req, res) => {
    controllers.getRecentPosts(req, res)
});

app.get('/api/posts/popular', (req, res) => {
    controllers.getPopularPosts(req, res)
});

app.get('/api/posts/user/:userId', (req, res) => {
    controllers.getPostsByUserId(req, res)
});

// Image upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
    controllers.uploadImage(req, res)
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
