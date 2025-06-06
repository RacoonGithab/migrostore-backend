export const redisConstants = {
    USER_DAILY_RESUME_COUNT: (userId: string) => `user:${userId}:resumes:daily`,
    ONE_DAY_IN_SECONDS: 24 * 60 * 60, // 24 часа
    DAILY_RESUME_LIMIT: 2
};
