import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { env } from '../utils/env';


export const handlerAllException = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("-------------------------------------------------------------------------------");
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    if (err instanceof Error) {
        return res.status(statusCode).json({
            status: "error",
            statusCode,
            message,
        });
    }

    return res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
}