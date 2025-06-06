export interface CreateResumeSkillDto {
    resumeId: string;
    skillId: string
}

export interface CreateSkillDto {
    name: string
    userId: string;
}

export interface DeleteSkillDto {
    skillId: string;
    userId: string;
}