import {getBucket} from "../../config/firebase";
import ApiError from "../../errors/api.error";
import {error} from "../constants/error.masseges";
import {Readable} from "stream";


export const getPdfFileFromStorage = async (filePath: string): Promise<Buffer> => {
    const bucket = getBucket();

    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (!exists) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    const [buffer] = await file.download();

    return buffer;
};

export const bufferToStream = (buffer: Buffer): Readable => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};