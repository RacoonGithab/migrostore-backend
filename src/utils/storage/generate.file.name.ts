import {GenerateFileNameDto} from "../../types/dto/resume.dto";

export const generateFileName = (data: GenerateFileNameDto): string => {
    const safeFirstName = data.firstName;

    const safeLastName = data.lastName;

    return `${safeFirstName}_${safeLastName}`;
}