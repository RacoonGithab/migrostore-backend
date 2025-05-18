export interface CreateResumeDto {
    firstName: string;
    lastName: string;
    age: number;
    education: string;
    workExperience: string;
    aboutMe: string;
    userId: string;
    city: string;
    skills: string[];
    pdfFilename?: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface GeneratePdfResumeDto {
    firstName: string;
    lastName: string;
    age: number;
    education: string;
    workExperience: string;
    aboutMe: string;
    userId: string;
    city: string;
    skills: string[];
    photo?: string;
    pdfFilename?: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface UploadResumeToStorageDto {
    buffer: Buffer;
    userId: string;
    resumeId: string;
}

export interface findResumeByIdAndUserIdDto {
    userId: string,
    resumeId: string,
}