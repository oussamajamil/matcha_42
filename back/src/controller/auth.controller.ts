import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { env } from '../utils/env';
import { query } from '../postgres/db';
import { AuthService } from '../service/auth.service';



const authService = new AuthService();
class AuthController{
    async login(req: Request, res: Response){
        try {
            const { email, password } = req.body;
            const data = await authService.login(email, password);
            res.status(httpStatus.OK).json(data);
        } catch (error:any) {
            res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
        }


    }
    async refreshToken(req: Request, res: Response){
    }
    async logout(req: Request, res: Response){
    }
}

export default new AuthController();