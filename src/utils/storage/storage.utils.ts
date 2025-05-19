import {RESUME_FOLDER} from "../constants/storage.constants";

export const generateResumeFilePath = (userId: string, filename: string): string => {
    return `${RESUME_FOLDER}/${userId}/${filename}.pdf`;
};