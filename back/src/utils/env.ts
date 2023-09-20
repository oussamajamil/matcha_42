import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_DATABASE || 'matcha',
        userName: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    },  
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    REFJWT_SECRET: process.env.JWT_SECRET || 'secret',

};