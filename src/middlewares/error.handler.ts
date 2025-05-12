import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        console.error('Unhandled error:', err);
        res.status(500).json({ error: error.INTERNAL_SERVER_ERROR });
    }
};