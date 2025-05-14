import multer from "multer";
import { fileFilter } from "../utils/file-filter.util";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter }).single("photo");

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (req.file) {
            req.body.photoBase64 = req.file.buffer.toString("base64");
        }
        next();
    });
};