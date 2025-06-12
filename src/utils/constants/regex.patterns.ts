export const regexPatterns = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,12}$/,
    VERIFICATION_CODE: /^\d{6}$/,
    COUNTRY: /^[A-ZА-ЯІЇЄҐ][a-zA-Zа-яА-ЯіїІЇєЄґҐ\s-']{1,49}$/,
    CITY_NAME: /^[a-zA-Z0-9\s-ąćęłńóśźżĄĘŁŃÓŚŹŻ]{2,50}$/,
    SKILL_NAME: /^[a-zA-Z0-9\s.]{2,100}$/,
    FIRST_NAME: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ']{2,50}$/,
    LAST_NAME: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ']{2,50}$/,
    EDUCATION: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ0-9\s.,'-]{5,500}$/,
    WORK_EXPERIENCE: /^[\s\S]{10,2000}$/,
    ABOUT_ME: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ0-9\s.,'"()\-!?;:]{20,2000}$/
} as const;
