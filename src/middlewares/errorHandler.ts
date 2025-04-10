import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";
import {INTERNAL_SERVER_ERROR} from "../utils/constants/error.masseges";

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
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
};