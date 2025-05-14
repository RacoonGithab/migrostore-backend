import { FileFilterCallback } from "multer";
import { Request } from "express";

export const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = [".jpg", ".jpeg", ".png"];
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (!ext || !allowedTypes.includes(`.${ext}`)) {
        return cb(new Error("Unsupported file format. Only allowed .jpg, .jpeg, .png"));
    }
    cb(null, true);
};