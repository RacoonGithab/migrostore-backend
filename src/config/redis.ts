// src/config/redis.ts
import Redis from 'ioredis';
import dotenv from 'dotenv';
import {REDIS_HOST, REDIS_PORT} from "./secrets";

dotenv.config();

let redisClient: Redis | null = null;

const connectRedis = async (): Promise<Redis> => {
    if (!redisClient) {
        try {
            redisClient = new Redis({
                host: REDIS_HOST,
                port: REDIS_PORT,
            });

            redisClient.on('connect', () => {
                console.log('✅ Подключено к Redis!');
            });

            redisClient.on('error', (err) => {
                console.error('❌ Ошибка Redis:', err);
            });
        } catch (error) {
            console.error('❌ Ошибка при создании клиента Redis:', error);
            throw error;
        }
    }
    return redisClient;
};

const getRedisClient = (): Redis => {
    if (!redisClient) {
        throw new Error('Redis клиент не инициализирован. Сначала вызовите connectRedis().');
    }
    return redisClient;
};

export { connectRedis, getRedisClient };