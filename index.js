import express, { json } from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express(); // cria um servidor

app.use(cors());
app.use(json());
app.use(router);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});