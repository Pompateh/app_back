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
  image = 'image',
  full_image = 'full_image',
  side_by_side_image = 'side_by_side_image',
  three_grid_layout = 'three_grid_layout',
}

export enum LayoutDto {
  left = 'left',
  right = 'right',
}

export class ContentBlockDto {
  @IsEnum(BlockTypeDto)
  type: BlockTypeDto;

  // For text blocks
  @IsString()
  @IsOptional()
  text?: string;

  // For text & single-image pinning
  @IsEnum(LayoutDto)
  @IsOptional()
  layout?: LayoutDto;

  // For single-image blocks
  @IsString()
  @IsOptional()
  src?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  // For side-by-side & three-grid
  @IsObject()
  @IsOptional()
  data?: any;
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
  @IsOptional()
  description?: string; // Add this line

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  blocks: ContentBlockDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  team: TeamMemberDto[];
}