import {getBucket} from "../../config/firebase";


export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
    const bucket = getBucket();

    const file = bucket.file(filePath);

    const [exists] = await file.exists();

    if (exists) {
        await file.delete();
    }
}