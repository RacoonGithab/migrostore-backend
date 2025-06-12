export interface createCountryDto {
    name: string;
    userId: string;
}

export interface getCountryDto {
    countryId: string;
    userId: string;
}

export interface deleteCountryDto {
    countryId: string;
    userId: string;
}