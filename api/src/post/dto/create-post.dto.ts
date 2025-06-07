import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsJSON,
} from 'class-validator';
import { Type } from 'class-transformer';

class AdditionalContent {
  @IsString()
  title: string;

  @IsString()
  paragraph: string;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  @IsBoolean()
  published: boolean;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  referencePicUrl?: string;

  @IsString()
  @IsOptional()
  referencePicName?: string;

  @IsString()
  @IsOptional()
  authorName?: string;

  @IsString()
  @IsOptional()
  authorJobTitle?: string;

  @IsString()
  @IsOptional()
  postDate?: string;

  @IsString()
  @IsOptional()
  readingTime?: string;

  @IsArray()
  @IsOptional()
  contentSources?: string[];

  @IsString()
  @IsOptional()
  @IsJSON()
  additionalContent?: { title: string; paragraph: string }[];

  @IsString()
  @IsOptional()
  quote?: string;

  @IsString()
  @IsOptional()
  quoteAuthor?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  publishedAt?: string;
}