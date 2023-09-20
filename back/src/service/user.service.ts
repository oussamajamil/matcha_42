import { query } from '../postgres/db';
import { EasyParms } from '../utils/function';
import { ParamsQuery } from '../utils/types';



export class UserService{
    constructor(){}

  @EasyParms()
   async  getAllUser(params: ParamsQuery){
    try{
        const { skip, take, where } = params;
        const queryStr = `SELECT * FROM users ${where ? `WHERE ${where}` : ''} LIMIT ${take} OFFSET ${skip}`;
        const count = await query('SELECT COUNT(*) FROM users');
        const data = await query(queryStr);
        return {
            totalResults: +count.rows[0].count,
            results: data.rows
        };
    }
        catch(err){
            console.log("i am here");
            throw err;
        }
    }

    async getUserById(id: string){
        const data = await query('SELECT * FROM users WHERE id = $1', [+id]);
        return data;
    }

    async createUser(user: any){
        const data = await query('INSERT INTO users(first_name, last_name, username, password, email, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [user.first_name, user.last_name, user.username, user.password, user.email, user.role]);
        return data;
    }

    async updateUser(user: any){
        const data = await query('UPDATE users SET first_name = $1, last_name = $2, username = $3, password = $4, email = $5, role = $6 WHERE id = $7 RETURNING *', [user.first_name, user.last_name, user.username, user.password, user.email, user.role, user.id]);
        return data;
    }

    async deleteUser(id: string){
        const data = await query('DELETE FROM users WHERE id = $1', [+id]);
        return data;
    }
}

