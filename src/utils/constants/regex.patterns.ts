export const regexPatterns = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,12}$/,
    VERIFICATION_CODE: /^\d{6}$/,
} as const;
