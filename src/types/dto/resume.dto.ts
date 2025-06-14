import {Education, Language, LanguageLevel, LanguageSkill, Resume, WorkExperience} from "@prisma/client";

export interface CreateResumeDto {
    title: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    photo?: string;
    dateOfBirth: Date;
    country?: string;
    aboutMe: string;
    skills?: string[];
    qualification?: string;
    userId: string;

    workExperiences?: CreateWorkExperienceDto[];
    educations?: CreateEducationDto[];
    languageSkills?: CreateLanguageSkillDto[];
}

export interface CreateWorkExperienceDto {
    position: string;
    companyName: string;
    startDate: string;
    endDate?: string;
    isCurrentWork: boolean;
}

export interface CreateEducationDto {
    specialty: string;
    institutionName: string;
    startDate: string;
    endDate?: string;
    isCurrentStudy: boolean;
}


export interface CreateLanguageSkillDto {
    language: Language;
    level: LanguageLevel;
}

export interface PdfTemplateDataDto {
    title: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    dateOfBirth: Date;
    country: string | null;
    qualification: string | null;
    aboutMe: string | null;
    skills: string[];

    workExperiences?: WorkExperience[];
    educations?: Education[];
    languageSkills?: LanguageSkill[];
}

export interface FullResume extends Resume {
    workExperiences: WorkExperience[];
    educations: Education[];
    languageSkills: LanguageSkill[];
}

export interface UpdateResumeDto {
    title?: string;
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    aboutMe?: string;
    skills?: string[];
    photo?: string | null;
    clearPhoto?: boolean;
    country?: string;
    qualification?: string;

    workExperiences?: (CreateWorkExperienceDto & { id?: string })[];
    educations?: (CreateEducationDto & { id?: string })[];
    languageSkills?: (CreateLanguageSkillDto & { id?: string })[];
}

export interface UpdateResumeServiceDto extends UpdateResumeDto {
    resumeId: string;
    userId: string;
}

export interface UploadFileToStorageDto {
    buffer: Buffer;
    resumeName: string;
    filename: string;
    userId: string;
    contentType?: string;
}

export interface findResumeByIdAndUserIdDto {
    userId: string,
    resumeId: string,
}

export interface UserResumeByIdDto {
    id: string;
    title: string;
    skills: string[];
}

export interface DeleteResumeByIdDto {
    userId: string,
    resumeId: string,
}


export interface generateFilePathDto {
    userId: string,
    resumeName: string,
    originalFilename: string
}

export interface GenerateFileNameDto {
    firstName: string,
    lastName: string,
}