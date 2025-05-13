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
    photo?: string;
    pdfUrl?: string;
    updatedAt: Date;
    createdAt: Date;
}