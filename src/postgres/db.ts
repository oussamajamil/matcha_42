import {Pool} from 'pg';
import {env} from '../utils/env';


const pool = new Pool({
    user: env.db.userName,
    host: env.db.host,
    password: env.db.password,
    port: +env.db.port
});



export const query = async (text: string, params: any[] = []) => {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release(); // Release the client back to the pool when done
    }
  };


export default pool;