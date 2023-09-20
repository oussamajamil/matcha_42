import express from 'express';
import pool from './postgres/db';
import { env } from './utils/env';
import cors from 'cors';
import router from './router';
import WebSocket from 'ws';
import { handlerAllException } from './middleware/all_error';



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));



////// ----- route ---/////////////
app.use('/api',router)


///middleware////
app.use(handlerAllException)

app.listen(env.port, () => {
    console.log(`Server is listening on port ${env.port}`);
}
);
