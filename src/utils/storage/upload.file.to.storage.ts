import {getBucket} from "../../config/firebase";
import {UploadResumeToStorageDto} from "../../types/dto/resume.dto";

export const uploadFileToStorage = async (data: UploadResumeToStorageDto): Promise<string> => {
    const bucket = getBucket();

    const filename = data.filename;
    const destination = `resumes/${data.userId}/${filename}.pdf`;

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

