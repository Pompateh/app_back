import { Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectService {
    private prisma;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    findOneBySlug(slug: string): Promise<Project>;
    create(dto: CreateProjectDto): Promise<Project>;
    update(id: string, dto: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<Project>;
}
