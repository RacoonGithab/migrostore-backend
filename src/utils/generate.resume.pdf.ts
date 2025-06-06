import {PdfTemplateDataDto} from "../types/dto/resume.dto";
import { createResumeHtmlTemplate } from "./templates/create.pdf-template";
import {getBrowserInstance} from "../config/puppeteer-browser";
import {Resume} from "@prisma/client";
import {getBucket} from "../config/firebase";

export const generateResumePdf = async (resumeData: Resume): Promise<Buffer | null> => {
    const browserInstance = await getBrowserInstance();
    const page = await browserInstance.newPage();

    let photoUrlForPdf: string | undefined;

    if (resumeData.photo) {
        const bucketName = getBucket().name;
        photoUrlForPdf = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(resumeData.photo)}?alt=media`;
    }

    const templateData: PdfTemplateDataDto = {
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        age: resumeData.age,
        education: resumeData.education,
        workExperience: resumeData.workExperience,
        aboutMe: resumeData.aboutMe,
        city: resumeData.city,
        skills: resumeData.skills,
        photoUrl: photoUrlForPdf,
    };

    const html = createResumeHtmlTemplate(templateData);

    await page.setContent(html, {
        waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    }) as Buffer;

    await page.close();

    return pdfBuffer;
};