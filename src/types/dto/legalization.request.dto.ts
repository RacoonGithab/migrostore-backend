import {ContactTimeRange, LegalizationService} from "@prisma/client";

export interface LegalizationRequestDto {
    fullName: string;
    phoneNumber: string;
    email: string;
    city: string;
    service: LegalizationService;
    timeRange: ContactTimeRange;
    comment: string;
    userId: string;
}