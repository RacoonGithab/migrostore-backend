import {getBucket} from "../../config/firebase";
import ApiError from "../../errors/api.error";
import {error} from "../constants/error.masseges";
import {Readable} from "stream";


export const getPdfFileFromStorage = async (filePath: string): Promise<Readable> => {
    const bucket = getBucket();

    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (!exists) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    return file.createReadStream();
};