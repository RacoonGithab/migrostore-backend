import {getRedisClient} from "../config/redis";
import {tokenService} from "./token.service";
import {RefreshTokenPayload, TokenPayload} from "../types/token.payload.dto";

const addJtiToBlacklist = async (jti: string, expirationTimeSec: number): Promise<void> => {
    const client = getRedisClient();
    await client.setex(jti, expirationTimeSec, 'blacklisted');
};

const isJtiBlacklisted = async (jti: string): Promise<boolean> => {
    const client = getRedisClient();
    const result = await client.get(jti);
    return result === 'blacklisted';
};

const checkIfJtiExistsInBlacklist = async (jti: string): Promise<boolean> => {
    const client = getRedisClient();
    const exist = await client.exists(jti);
    return exist === 1;
};

const blackListToken = async (token: string): Promise<void> => {
    const payload = tokenService.verifyAccessToken(token) as (TokenPayload & { jti?: string; exp?: number }) |
        (RefreshTokenPayload & { jti?: string; exp?: number });
    if (payload?.jti && payload.exp) {
        const expirationTimeSec = payload.exp - Math.floor(Date.now() / 1000);
        await addJtiToBlacklist(payload.jti, expirationTimeSec);
    }
}

export const redisService = {
    addJtiToBlacklist,
    isJtiBlacklisted,
    checkIfJtiExistsInBlacklist,
    blackListToken,
}
