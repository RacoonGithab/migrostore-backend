import { CreateResumeDto } from "../types/dto/resume.dto";
import { generateResumePdf } from "../utils/generate.resume.pdf";
import { uploadFileToStorage } from "../utils/storage/upload.file.to.storage";

export const generateAndSaveResumePdf = async (
    data: CreateResumeDto,
    userId: string,
    resumeId: string
): Promise<string | null> => {
    try {
        const pdfBuffer = await generateResumePdf(data);
        if (!pdfBuffer) {
            console.error("Error generating PDF");
            return null;
        }

        return await uploadFileToStorage({ buffer: pdfBuffer, userId: userId, resumeId: resumeId });
    } catch (error) {
        console.error("Error generating and saving PDF:", error);
        return null;
    }
};