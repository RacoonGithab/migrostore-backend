import {FullResume, PdfTemplateDataDto} from "../types/dto/resume.dto";
import { createResumeHtmlTemplate } from "./templates/create.pdf-template";
import {getBrowserInstance} from "../config/puppeteer-browser";
import {getBucket} from "../config/firebase";

export const generateResumePdf = async (resumeData: FullResume): Promise<Buffer | null> => {
    const browserInstance = await getBrowserInstance();
    const page = await browserInstance.newPage();

    let photoUrlForPdf: string | undefined;
    if (resumeData.photo) {
        const bucketName = getBucket().name;
        photoUrlForPdf = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(resumeData.photo)}?alt=media`;
    }

    const templateData: PdfTemplateDataDto = {
        title:resumeData.title,
        email: resumeData.email,
        phoneNumber: resumeData.phoneNumber,
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        photoUrl: photoUrlForPdf,
        dateOfBirth: resumeData.dateOfBirth,
        country: resumeData.country,
        aboutMe: resumeData.aboutMe,
        skills: resumeData.skills,
        qualification: resumeData.qualification,

        workExperiences: resumeData.workExperiences,
        educations: resumeData.educations,
        languageSkills: resumeData.languageSkills,
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