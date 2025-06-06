import {getBucket} from "../../config/firebase";
import {UploadFileToStorageDto} from "../../types/dto/resume.dto";
import {generateFilePath} from "./generate.file.path";


export const uploadFileToStorage = async (data: UploadFileToStorageDto): Promise<string> => {
    const bucket = getBucket();

    const destination = generateFilePath(
        {
            userId: data.userId,
            resumeId: data.resumeId,
            originalFilename: data.filename
        }
    );

    const file = bucket.file(destination);

    await new Promise<void>((resolve, reject) => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: data.contentType || 'application/octet-stream',
            },
            resumable: false,
        });
        stream.on('finish', resolve);
        stream.on('error', reject);
        stream.end(data.buffer);
    });

    return destination;
};

