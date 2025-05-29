import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

// Mirror your Prisma enums here to validate input
export enum BlockTypeDto {
  text = 'text',
  full_image = 'full_image',
  side_by_side_image = 'side_by_side_image',
  text_and_side_image = 'text_and_side_image',
  three_grid_layout = 'three_grid_layout',
}

export class ContentBlockDto {
  @IsEnum(BlockTypeDto)
  type: BlockTypeDto;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  src?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class TeamMemberDto {
  @IsString()
  name: string;

  @IsString()
  role: string;
}

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  team: TeamMemberDto[];
}
