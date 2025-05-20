import {getRedisClient} from "../config/redis";
import {getResumeRedisCacheDto, setCachedResumePdfDto} from "../types/dto/resume.dto";
import {bufferToStream} from "./storage/get.pdf.from.storage";
import {PDF_CACHE_TTL_SECONDS} from "./constants/redis.constants";
import {Readable} from "stream";


const getCachedResumePdf = async (data: getResumeRedisCacheDto): Promise<Readable | null> => {
    const redis = getRedisClient();
    const cacheKey = `resume_pdf:${data.userId}:${data.resumeId}`;

    const cachedPdfBuffer = await redis.getBuffer(cacheKey);

    if (cachedPdfBuffer) {
        await redis.expire(cacheKey, PDF_CACHE_TTL_SECONDS);
        return bufferToStream(cachedPdfBuffer);
    } else {
        return null;
    }
};


const setCachedResumePdf = async (data: setCachedResumePdfDto): Promise<void> => {
    const redis = getRedisClient();
    const cacheKey = `resume_pdf:${data.userId}:${data.resumeId}`;

    console.log(`[setCachedResumePdf] Caching PDF in Redis for key: ${cacheKey}`);
    await redis.setex(cacheKey, PDF_CACHE_TTL_SECONDS, data.pdfBuffer);
};



export const redisResumeUtils = {
    getCachedResumePdf,
    setCachedResumePdf,
}