import {getRedisClient} from "../config/redis";
import {redisConstants} from "./constants/redis.constants";

export const checkAndIncrementDailyResumeCount = async (
    userId: string,
): Promise<number> => {
    const key = redisConstants.USER_DAILY_RESUME_COUNT(userId);
    const expirationInSeconds = redisConstants.ONE_DAY_IN_SECONDS;
    const redisClient = getRedisClient();

    const result = await redisClient.multi()
        .incr(key)
        .expire(key, expirationInSeconds)
        .exec();

    if (!result || !result[0]) {
        throw new Error("Redis transaction did not return expected results.");
    }

    const currentCount = result[0][1] as number;

    console.log(`User ${userId} daily resume count incremented to: ${currentCount}`);
    return currentCount;
};