import {addListener} from "nodemon";

export interface CreateSessionDto {
    userId: string;
    accessToken: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateSessionDto {
    id: string;
    isActive: boolean;
    updatedAt: Date;
}