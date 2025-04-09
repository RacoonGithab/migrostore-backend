import {Request, Response, NextFunction} from "express"


export const registerUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: "User already registered" });
    } catch (e) {
        next(e);
    }
}