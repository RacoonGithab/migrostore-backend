import { GeneratePdfResumeDto } from "../types/dto/resume.dto";
import { createResumeHtmlTemplate } from "./templates/create.pdf-template";
import {getBrowserInstance} from "../config/puppeteer-browser";

export const generateResumePdf = async (data: GeneratePdfResumeDto): Promise<Buffer | null> => {
    const browserInstance = await getBrowserInstance();
    const page = await browserInstance.newPage();
    const html = createResumeHtmlTemplate(data);

    await page.setContent(html, {
        waitUntil: 'domcontentloaded',
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    }) as Buffer;

    await page.close();

    return pdfBuffer;
};