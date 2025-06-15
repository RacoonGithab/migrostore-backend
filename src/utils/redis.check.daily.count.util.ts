import {getRedisClient} from "../config/redis";

export const checkDailyCount = async (
    userId: string,
    actionKeyPrefix: string
): Promise<number> => {
    const redisClient = getRedisClient();

    const now = new Date();
    const todayDateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const key = `${actionKeyPrefix}:${userId}:${todayDateString}`;

    const count = await redisClient.get(key);
    return parseInt(count || "0", 10);
};