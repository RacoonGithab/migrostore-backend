export const regexPatterns = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,12}$/,
    VERIFICATION_CODE: /^\d{6}$/,
    PHONE_NUMBER: /^\+[1-9]\d{1,14}$/,

    COUNTRY: /^[A-ZА-ЯІЇЄҐ][a-zA-Zа-яА-ЯіїІЇєЄґҐ\s-']{1,49}$/,
    CITY_NAME: /^[a-zA-Z0-9\s-ąćęłńóśźżĄĘŁŃÓŚŹŻ]{2,50}$/,

    SKILL_NAME: /^[a-zA-Z0-9\s.]{2,100}$/,

    FIRST_NAME: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ']{2,50}$/,
    LAST_NAME: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ']{2,50}$/,
    FULL_NAME: /^(?!.* {2})[a-zA-Zа-яА-ЯіїІЇєЄґҐ]{2,50}(?: [a-zA-Zа-яА-ЯіїІЇєЄґҐ'-]{2,50}){1,2}$/,

    EDUCATION: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ0-9\s.,'-]{5,500}$/,
    WORK_EXPERIENCE: /^[\s\S]{10,2000}$/,
    ABOUT_ME: /^[a-zA-Zа-яА-ЯіїІЇєЄґҐ0-9\s.,'"()\-!?;:]{20,2000}$/,
    COMMENT: /^[a-zA-Zа-яА-Я0-9іїІЇєЄґҐ\s.,'"()\-!?;:@%&/\\\[\]{}+=_*#№]{1,1000}$/,

    TITLE_POSITION_SPECIALTY_NAME: /^[\p{L}\p{N}\s.,'&-/#()]{2,150}$/u,
    COMPANY_INSTITUTION_NAME: /^[\p{L}\p{N}\s.,'&-/#()@_]{2,150}$/u,

    START_DATE: /^\d{4}-\d{2}-\d{2}$/,
    END_DATE: /^\d{4}-\d{2}-\d{2}$/,
} as const;
