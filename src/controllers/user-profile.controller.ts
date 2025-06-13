import {Response, Request} from "express";
import {userProfileService} from "../services/user-profile.service";

const createUserProfile = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const userProfileData = req.body;
    const createdUserProfile = await userProfileService.createUserProfile(userProfileData, userId);
    res.status(201).json(createdUserProfile);
}

const getUserProfile = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const userProfile = await userProfileService.getUserProfile(userId);
    res.status(201).json(userProfile);
}

const updateUserProfile = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const updateData = req.body;
    const updatedUserProfile = await userProfileService.updateUserProfile(updateData, userId);
    res.status(201).json(updatedUserProfile);
}

export const userProfileController = {
    createUserProfile,
    getUserProfile,
    updateUserProfile
}