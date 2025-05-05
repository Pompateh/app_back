import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enumerate all supported block types
export enum BlockTypeDto {
  TEXT = 'text',
  FULL_IMAGE = 'full_image',
  SIDE_BY_SIDE_IMAGE = 'side_by_side_image',
  TEXT_AND_SIDE_IMAGE = 'text_and_side_image',
  THREE_GRID_LAYOUT = 'three_grid_layout',
}

export class ContentBlockDto {
  @IsEnum(BlockTypeDto)
  type: BlockTypeDto;

  // For text and side-image layouts
  @IsOptional()
  @IsEnum(['left', 'right'])
  layout?: 'left' | 'right';

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
