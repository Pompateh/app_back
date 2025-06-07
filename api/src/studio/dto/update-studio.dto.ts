import { PartialType } from '@nestjs/mapped-types';
import { CreateStudioDto, PortfolioItemDto, FontItemDto, ArtworkItemDto } from './create-studio.dto';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Prisma } from '@prisma/client';

export class UpdateStudioDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  imageTitle?: string;

  @IsOptional()
  @IsString()
  imageDescription?: string;

  @IsOptional()
  @IsArray()
  openDays?: string[];

  @IsOptional()
  @IsString()
  openHours?: string;

  @IsOptional()
  navigation?: Prisma.JsonValue | string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsOptional()
  portfolio?: Prisma.JsonValue | string;

  @IsOptional()
  fonts?: Prisma.JsonValue | string;

  @IsOptional()
  artworks?: Prisma.JsonValue | string;
}
