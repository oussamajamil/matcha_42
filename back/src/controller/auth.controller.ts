import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { env } from '../utils/env';
import { query } from '../postgres/db';

class AuthController{
    async login(req: Request, res: Response){
        return res.status(httpStatus.OK).json({message: 'Login'});
    }
    async register(req: Request, res: Response){
        return res.status(httpStatus.OK).json({message: 'Register'});
    }
    async logout(req: Request, res: Response){
        return res.status(httpStatus.OK).json({message: 'Logout'});
    }
}

export default new AuthController();