import {getBucket} from "../../config/firebase";
import {UploadResumeToStorageDto} from "../../types/dto/resume.dto";
import { v4 as uuidv4 } from 'uuid';

export const uploadFileToStorage = async (data: UploadResumeToStorageDto): Promise<string> => {
    const bucket = getBucket();

    const filename = `${uuidv4()}.pdf`;
    const destination = `resumes/${data.userId}/${filename}`;

    const file = bucket.file(destination);

    await new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'application/pdf',
            },
            resumable: false,
        });
        stream.on('finish', resolve);
        stream.on('error', reject);
        stream.end(data.buffer);
    });

    return filename;
};

