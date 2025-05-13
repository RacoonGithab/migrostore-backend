export const regexPatterns = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,12}$/,
    VERIFICATION_CODE: /^\d{6}$/,
    CITY_NAME: /^[a-zA-Z0-9\s-]{2,50}$/,
    SKILL_NAME: /^[a-zA-Z0-9\s.]{2,100}$/,
} as const;
