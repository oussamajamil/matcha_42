import express from 'express';
import pool from './postgres/db';
import { env } from './utils/env';
import cors from 'cors';
import router from './router';
import WebSocket from 'ws';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));


//ROUTES
app.use('/api',router)


//WEBSOCKET
const wss = new WebSocket.Server({ port: 3003 });

//creaye database if not exist
const databaseQuery =  "SELECT 1 FROM  pg_database WHERE datname = $1";
pool.connect().then(async (client) => {
    const result = await client.query(databaseQuery, [env.db.database]);
    if (result.rowCount === 0) {
        await client.query(`CREATE DATABASE ${env.db.database}`);
    }
    client.release();
    pool.end();
});


app.listen(env.port, () => {
    console.log(`Server is listening on port ${env.port}`);
}
);
