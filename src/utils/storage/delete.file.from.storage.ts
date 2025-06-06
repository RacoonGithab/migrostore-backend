import {getBucket} from "../../config/firebase";
import ApiError from "../../errors/api.error"
import {error} from "../constants/error.masseges";


export const deleteFileFromStorage = async (filePath: string): Promise<boolean> => {
    const bucket = getBucket();

    const file = bucket.file(filePath);

    try {
        const [exists] = await file.exists();

        if (exists) {
            await file.delete();
            return true;
        } else {
            return true;
        }
    } catch (err) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }
}