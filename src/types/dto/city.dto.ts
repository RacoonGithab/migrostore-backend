export interface createCityDto {
    name: string,
    userId: string
}

export interface getCityDto {
    cityId: string;
    userId: string;
}

export interface deleteCityDto {
    cityId: string;
    userId: string;
}