import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class NavigationItemDto {
  @IsString()
  label: string;

  @IsString()
  href: string;
}

export class PortfolioItemDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsString()
  type: string;

  @IsNumber()
  year: number;
}

export class FontItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  type: string;

  @IsNumber()
  price: number;
}

export class ArtworkItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  author: string;

  @IsString()
  image: string;

  @IsString()
  type: string;
}

export class CreateStudioDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  imageDescription?: string;

  @IsString()
  @IsOptional()
  imageTitle?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  openDays?: string[];

  @IsString()
  @IsOptional()
  openHours?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  navigation?: NavigationItemDto[];

  @IsString()
  @IsOptional()
  slogan?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PortfolioItemDto)
  portfolio?: PortfolioItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FontItemDto)
  fonts?: FontItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ArtworkItemDto)
  artworks?: ArtworkItemDto[];
}