import httpStatus from 'http-status';
import { Request, Response } from 'express'
import {UserService} from '../service/user.service'
import { ParamsQuery } from '../utils/types';



const userService = new UserService();
class UserController{
    async getAllUser(req: Request, res: Response){
        const data = await userService.getAllUser(req.query as ParamsQuery);
        res.status(httpStatus.OK).json(data);
    }
    async getUserById(req: Request, res: Response){
        const data = await userService.getUserById(req.params.id);
        res.status(httpStatus.OK).json(data);
    }

    async createUser(req: Request, res: Response){
        const data = await userService.createUser(req.body);
        res.status(httpStatus.CREATED).json(data);
    }

    async updateUser(req: Request, res: Response){
        const data = await userService.updateUser(req.body);
        res.status(httpStatus.OK).json(data);
    }

    async deleteUser(req: Request, res: Response){
        const data = await userService.deleteUser(req.params.id);
        res.status(httpStatus.OK).json(data);
    }

}

export default  new UserController();