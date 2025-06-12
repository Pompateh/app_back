import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentBlockDto, TeamMemberDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    slug?: string;
  
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    studioId?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentBlockDto)
    blocks?: ContentBlockDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TeamMemberDto)
    team?: TeamMemberDto[];
  }
