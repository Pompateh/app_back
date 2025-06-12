export declare class NavigationItemDto {
    label: string;
    href: string;
}
export declare class PortfolioItemDto {
    id: string;
    title: string;
    image: string;
    type: string;
    year: number;
}
export declare class FontItemDto {
    id: string;
    name: string;
    image: string;
    type: string;
    price: number;
}
export declare class ArtworkItemDto {
    id: string;
    name: string;
    author: string;
    image: string;
    type: string;
}
export declare class CreateStudioDto {
    name: string;
    description?: string;
    thumbnail?: string;
    logo?: string;
    author?: string;
    imageDescription?: string;
    imageTitle?: string;
    openDays?: string[];
    openHours?: string;
    navigation?: NavigationItemDto[];
    slogan?: string;
    portfolio?: PortfolioItemDto[];
    fonts?: FontItemDto[];
    artworks?: ArtworkItemDto[];
}
