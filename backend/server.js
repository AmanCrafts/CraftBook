import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {controllers} from './controllers.js'



dotenv.config()
const app = express();



const PORT = 3000
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.status(200).send('The server is running.')
})

app.get('/api/users', (req, res) => {
    controllers.getAllUsers(req, res)
});

app.post('/api/users', (req, res) => {
    controllers.createUser(req, res)
})




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
