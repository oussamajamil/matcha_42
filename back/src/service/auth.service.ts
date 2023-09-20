import { query } from '../postgres/db';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { env } from '../utils/env';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';




export class AuthService{

    async login(email:string , password:string){
        const data = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (data.rows.length === 0) {
            throw new Error('User not found');
        }
        const user = data.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect password');
        }
        const token = jwt.sign({ id: user.id,email:user.email }, env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id,email:user.email }, env.REFJWT_SECRET, { expiresIn: '7d' });
        return{
            token,
            refreshToken,
            user:{
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }
    }

    async refreshToken(refreshToken:string){
        const data = await query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
        return data;
    }

    async logout(refreshToken:string){
        const data = await query('UPDATE users SET refresh_token = null WHERE refresh_token = $1', [refreshToken]);
        return data;
    }

}