import dotenv from 'dotenv';

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    REDIS_CONTAINER_NAME: process.env.REDIS_CONTAINER_NAME || 'redis',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    VERIFICATION_CODE_TTL: process.env.VERIFICATION_CODE_TTL!,
    SMTP_EMAIL_HOST: process.env.SMTP_EMAIL_HOST as string | undefined,
    SMTP_EMAIL_PORT: process.env.SMTP_EMAIL_PORT ? parseInt(process.env.SMTP_EMAIL_PORT, 10) : undefined,
    EMAIL_HOST_USER: process.env.EMAIL_HOST_USER as string | undefined,
    EMAIL_HOST_PASSWORD: process.env.EMAIL_HOST_PASSWORD as string | undefined,
    MAX_DAILY_VERIFICATION_CODES: parseInt(process.env.MAX_DAILY_VERIFICATION_CODES!)
} as const;