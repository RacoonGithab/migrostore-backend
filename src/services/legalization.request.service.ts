import {usersRepository} from "../repositories/user.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {LegalizationRequestDto} from "../types/dto/legalization.request.dto";
import {legalizationRequestRepository} from "../repositories/legalization.request.repository";
import {env} from "../config/secrets";
import {checkDailyCount} from "../utils/redis.check.daily.count.util";
import {redisConstants} from "../utils/constants/redis.constants";
import {incrementDailyCount} from "../utils/increment.daily.count";

const createLegalizationRequest = async (data: LegalizationRequestDto, userId: string): Promise<void> => {
    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const currentDailyCount = await checkDailyCount(
        userId,
        redisConstants.USER_LEGALIZATION_REQUEST_COUNT_PREFIX
    );

    if (currentDailyCount >= redisConstants.DAILY_LEGALIZATION_REQUEST_LIMIT) {
        throw new ApiError(429, error.TOO_MANY_REQUESTS_DAILY);
    }

    const legalizationRequestDb = await legalizationRequestRepository.getLegalizationRequestsBuUserId(userId)

    if (legalizationRequestDb.length >= env.MAX_TOTAL_LEGALIZATION_REQUEST) {
        throw new ApiError(429, error.LEGALIZATION_REQUEST_LIMIT_EXCEEDED_TOTAL);
    }

    await legalizationRequestRepository.createLegalizationRequestByUserID({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        city: data.city,
        service: data.service,
        timeRange: data.timeRange,
        comment: data.comment,
        userId: userId,
    })

    await incrementDailyCount(
        userId,
        redisConstants.USER_LEGALIZATION_REQUEST_COUNT_PREFIX
    );
}

export const legalizationRequestService = {
    createLegalizationRequest
}