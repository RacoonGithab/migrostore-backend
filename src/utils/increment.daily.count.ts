import {getRedisClient} from "../config/redis";
import {redisConstants} from "./constants/redis.constants";

export const incrementDailyCount = async (
    userId: string,
    actionKeyPrefix: string
): Promise<number> => {
    const redisClient = getRedisClient();

    const now = new Date();
    const todayDateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const key = `${actionKeyPrefix}:${userId}:${todayDateString}`;

    const endOfDay = new Date(now);
    endOfDay.setHours(
        redisConstants.END_OF_DAY_HOUR,
        redisConstants.END_OF_DAY_MINUTE,
        redisConstants.END_OF_DAY_SECOND,
        redisConstants.END_OF_DAY_MILLISECOND
    );

    const expirationInSeconds = Math.ceil((endOfDay.getTime() - now.getTime()) / 1000);
    const finalExpirationSeconds = Math.max(1, expirationInSeconds);

    const result = await redisClient.multi()
        .incr(key)
        .expire(key, finalExpirationSeconds)
        .exec();

    if (!result || !result[0]) {
        throw new Error("Redis transaction did not return expected results.");
    }
    return result[0][1] as number;
};