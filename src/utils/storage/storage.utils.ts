import {RESUME_FOLDER} from "../constants/storage.constants";

export const generateResumeFilePath = (userId: string, pdfFilename: string): string => {
    return `${RESUME_FOLDER}/${userId}/${pdfFilename}`;
};