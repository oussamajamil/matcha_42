import pool from "../postgres/db";
import { env } from "../utils/env";
import { hashPassword } from "../utils/function";
import logMessage, { colorsLog, iconsLog } from "../utils/logMessage";



const dropTables = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;
    DROP TABLE IF EXISTS locations CASCADE;
    DROP TABLE IF EXISTS avatars CASCADE;
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS notifications CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
`;
const tables = ` 

    /*  create  function the create the type beacause sql not accepte if not exist type create type */
    DO $$ 
    BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN 
        CREATE TYPE  role_enum AS ENUM ('ADMIN', 'USER');
    END IF; 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_enum') THEN 
        CREATE TYPE  type_enum AS ENUM ('LIKE', 'VIEW');
    END IF; 
    END $$;

    /* crete table user */
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        role role_enum  NOT NULL DEFAULT 'USER',
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    /* create table profile*/
    CREATE TABLE IF NOT EXISTS profiles(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        bio VARCHAR(1000) NOT NULL,
        interests VARCHAR(100)[], 
        created_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    /* create table  locations*/
    CREATE TABLE IF NOT EXISTS locations(
         id SERIAL PRIMARY KEY,
         profile_id INT NOT NULL UNIQUE,
         geo_location GEOMETRY (POINT, 4326),
         FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    /* create table avatars*/
    CREATE TABLE IF NOT EXISTS avatars(
        id SERIAL PRIMARY KEY,
        profile_id INT NOT NULL UNIQUE,
        avatar_url VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );


    /* create messages tables */
    CREATE TABLE IF NOT EXISTS messages(
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    /* create notifications */
    CREATE TABLE IF NOT EXISTS notifications(
        id SERIAL PRIMARY KEY,
        from_id INT NOT NULL,
        to_id INT NOT NULL,
        content VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (from_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (to_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    /* create table events*/
    CREATE TABLE IF NOT EXISTS events(
        id SERIAL PRIMARY KEY,
        from_id INT NOT NULL,
        to_id INT NOT NULL,
        type type_enum NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        FOREIGN KEY (from_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (to_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
`;


const seed = `
    INSERT INTO users(first_name, last_name, username, password, email, role) VALUES
    ($1, $2, $3, $4, $5, $6)`;



pool.connect().then(async (client) => {
    try{
        const result = await client.query("SELECT 1 FROM  pg_database WHERE datname = $1", [env.db.database]);

        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE ${env.db.database}`);
        }
        else
        {
        
            await client.query(dropTables);
            logMessage("tables dropped", colorsLog.green, iconsLog.success);
            await client.query(tables);
            logMessage("tables created", colorsLog.green, iconsLog.success);
            let password:string = await hashPassword("12345678");
            await client.query(seed, ['oussama', 'jamil', 'ojamil',password, 'oussamajamil01@gmial.com', 'ADMIN']); 
            logMessage(`user created successfully \n`, colorsLog.green, iconsLog.success);
            logMessage(`information:\n{\n username: ojamil,\n password: 12345678,\n email: oussamajamil01@gmail.com,\n role: ADMIN\n}`,colorsLog.reset, iconsLog.info)
            client.release();
            pool.end();
            return;
        }
    }
    catch(error:any)
    {
        client.release();
        pool.end();
        logMessage(error?.message || 
        "something went wrong while creating tables", colorsLog.red, iconsLog.error);
        return;
    }
});
