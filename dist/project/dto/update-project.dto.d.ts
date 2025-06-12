import { CreateProjectDto } from './create-project.dto';
import { ContentBlockDto, TeamMemberDto } from './create-project.dto';
declare const UpdateProjectDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProjectDto>>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
    title?: string;
    slug?: string;
    type?: string;
    description?: string;
    studioId?: string;
    userId?: string;
    category?: string;
    thumbnail?: string;
    blocks?: ContentBlockDto[];
    team?: TeamMemberDto[];
}
export {};
