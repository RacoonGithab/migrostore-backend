import {PHOTO_FOLDER} from "../constants/storage.constants";
import {generateFilePathDto} from "../../types/dto/resume.dto";

export const generateFilePath = (data: generateFilePathDto): string => {
    const standardFileName = `${data.resumeName}`;

    return `${PHOTO_FOLDER}/${data.userId}/${data.resumeName}/${standardFileName}`;
};