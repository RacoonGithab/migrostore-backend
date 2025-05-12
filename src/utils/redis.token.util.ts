import {getRedisClient} from "../config/redis";
import {tokenUtils} from "./token.util";

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
    const decodedToken = tokenUtils.decodeToken(token);
    if (decodedToken && 'jti' in decodedToken && 'exp' in decodedToken && typeof decodedToken.exp === 'number') {
        const expirationTimeSec = decodedToken.exp - Math.floor(Date.now() / 1000);
        await addJtiToBlacklist(decodedToken.jti, expirationTimeSec);
    }
}

export const tokenRedisUtil = {
    addJtiToBlacklist,
    isJtiBlacklisted,
    checkIfJtiExistsInBlacklist,
    blackListToken,
}