import {Response, Request} from "express";

const createUserProfile = async (req: Request, res: Response) => {
    const {userId} = req.params;
    res.status(201).send({message: "User profile created successfully."});
}

const getUserProfile = async (req: Request, res: Response) => {
    const {userId} = req.params;
    res.status(201).send({message: "User profile get successfully."});
}

const updateUserProfile = async (req: Request, res: Response) => {
    const {userId} = req.params;
    res.status(201).send({message: "User profile updated successfully."});
}

export const userProfileController = {
    createUserProfile,
    getUserProfile,
    updateUserProfile
}