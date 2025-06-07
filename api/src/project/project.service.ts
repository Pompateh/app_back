import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma, Project, BlockType } from '@prisma/client';
import slugify from 'slugify';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  private prisma = new PrismaClient();

  /**
   * Retrieve all projects with their blocks and team members.
   */
  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({ include: { blocks: true, team: true } });
  }

  /**
   * Find a project by its database ID.
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { blocks: true, team: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  /**
   * Find a project by its slug.
   */
  async findOneBySlug(slug: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: { blocks: true, team: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
    return project;
  }

  /**
   * Create a new project along with its blocks and team members.
   */
  async create(dto: CreateProjectDto): Promise<Project> {
    const slug = slugify(dto.title, { lower: true });
    return this.prisma.project.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description || '',
        thumbnail: dto.thumbnail,
        category: dto.category,
        blocks: {
          create: dto.blocks.map((b) => ({
            type: b.type as BlockType,
            text: b.text,
            layout: (b as any).layout,
            src: b.src,
            alt: b.alt,
            data: b.data,
          })),
        },
        team: {
          create: dto.team.map((m) => ({ name: m.name, role: m.role })),
        },
      },
      include: { blocks: true, team: true },
    });
  }

  /**
   * Update an existing project and its related blocks and team.
   */
  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const data: Prisma.ProjectUpdateInput = {} as any;

    // Update basic fields
    if (dto.title) {
      data.title = dto.title;
      data.slug = slugify(dto.title, { lower: true });
    }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.thumbnail !== undefined) data.thumbnail = dto.thumbnail;
    if (dto.category !== undefined) data.category = dto.category;

    // Replace blocks if provided
    if (dto.blocks) {
      data.blocks = {
        deleteMany: { projectId: id },
        create: dto.blocks.map((b) => ({
          type: b.type as BlockType,
          text: b.text,
          layout: (b as any).layout,
          src: b.src,
          alt: b.alt,
          data: b.data,
        })),
      };
    }

    // Replace team members if provided
    if (dto.team) {
      data.team = {
        deleteMany: { projectId: id },
        create: dto.team.map((m) => ({ name: m.name, role: m.role })),
      };
    }

    try {
      return await this.prisma.project.update({
        where: { id },
        data,
        include: { blocks: true, team: true },
      });
    } catch (err: any) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      throw err;
    }
  }

  /**
   * Delete a project and all its related blocks and team members.
   */
  async remove(id: string): Promise<Project> {
    const [ , , deletedProject ] = await this.prisma.$transaction([
      this.prisma.contentBlock.deleteMany({ where: { projectId: id } }),
      this.prisma.teamMember.deleteMany({ where: { projectId: id } }),
      this.prisma.project.delete({ where: { id } }),
    ]);
    return deletedProject;
  }
}
