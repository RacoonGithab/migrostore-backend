import { Request, Response, NextFunction } from 'express';
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";

export const requireRole = (requiredRole: string) => {
    return (req: Request<{ userId: string; role: string }>, res: Response, next: NextFunction) => {
        const userRole = req.params.role;

        if (userRole !== requiredRole) {
            throw new ApiError(403, error.FORBIDDEN)
        }

        next();
    };
};