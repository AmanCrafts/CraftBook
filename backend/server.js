import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { debug } from 'openai/core.mjs';
dotenv.config()

const app = express();



const PORT = process.env.PORT
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('The server is running.')
})


app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});
