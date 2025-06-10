export interface CreateResumeDto {
    id: string;
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
    updatedAt: Date;
    createdAt: Date;
}

export interface PdfTemplateDataDto {
    firstName: string;
    lastName: string;
    age: number;
    education: string | null;
    workExperience: string | null;
    aboutMe: string | null;
    city: string  | null;
    skills: string[];
    photoUrl?: string;
}

export interface UpdateResumeDto {
    firstName?: string;
    lastName?: string;
    age?: number;
    education?: string;
    workExperience?: string;
    aboutMe?: string;
    city?: string;
    skills?: string[];
    photo?: string | null;
    clearPhoto?: boolean;
}

export interface UpdateResumeServiceDto extends UpdateResumeDto {
    resumeId: string;
    userId: string;
}

export interface UploadFileToStorageDto {
    buffer: Buffer;
    resumeId: string;
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
    skills: string[];
    city: string | null;
}

export interface getResumeRedisCacheDto {
    userId: string,
    resumeId: string,
}

export interface setCachedResumePdfDto {
    userId: string,
    resumeId: string,
    pdfBuffer: Buffer
}

export interface DeleteResumeByIdDto {
    userId: string,
    resumeId: string,
}


export interface generateFilePathDto {
    userId: string,
    resumeId: string,
    originalFilename: string
}

export interface GenerateFileNameDto {
    firstName: string,
    lastName: string,
}