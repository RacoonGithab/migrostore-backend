export const redisConstants = {
    ONE_DAY_IN_SECONDS: 24 * 60 * 60, // 24 часа
    DAILY_RESUME_LIMIT: 2,
    DAILY_LEGALIZATION_REQUEST_LIMIT: 3,

    USER_RESUME_COUNT_PREFIX: 'user_resume_count',
    USER_LEGALIZATION_REQUEST_COUNT_PREFIX: 'user_legalization_request_count',

    // Время для установки конца дня (для setHours)
    END_OF_DAY_HOUR: 23,
    END_OF_DAY_MINUTE: 59,
    END_OF_DAY_SECOND: 59,
    END_OF_DAY_MILLISECOND: 999,

};
