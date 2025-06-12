import { Prisma } from '@prisma/client';
export declare class UpdateStudioDto {
    name?: string;
    description?: string;
    thumbnail?: string;
    logo?: string;
    author?: string;
    imageTitle?: string;
    imageDescription?: string;
    openDays?: string[];
    openHours?: string;
    navigation?: Prisma.JsonValue | string;
    slogan?: string;
    portfolio?: Prisma.JsonValue | string;
    fonts?: Prisma.JsonValue | string;
    artworks?: Prisma.JsonValue | string;
}
