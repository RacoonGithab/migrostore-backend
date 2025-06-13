import {EntryBasis, LanguageLevel} from "@prisma/client";

export interface createUserProfileDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    country?: string;
    entryBasis?: EntryBasis;
    citiesForJob?: string[];
    polishLanguageLevel?: LanguageLevel;
    englishLanguageLevel?: LanguageLevel;
    skills?: string[];
    userId: string;
}

export interface updateUserProfileDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    email: string;
    country?: string;
    entryBasis?: EntryBasis;
    citiesForJob?: string[];
    polishLanguageLevel?: LanguageLevel;
    englishLanguageLevel?: LanguageLevel;
    skills?: string[];
    userId: string;
}