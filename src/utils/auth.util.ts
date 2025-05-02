import bcrypt from "bcryptjs";
import {env} from "../config/secrets";

export const createPasswordHash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 12);
}

export const createSessionExpirationDate = (): Date => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.SESSION_DURATION_DAYS);
    return expiresAt;
};