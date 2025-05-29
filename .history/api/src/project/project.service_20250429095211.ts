import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Project } from '@prisma/client';
import slugify from 'slugify';
import { CreateProjectDto, BlockTypeDto, LayoutDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  private prisma = new PrismaClient();

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      include: { blocks: true, team: true },
    });
  }

  
  async findOneBySlug(slug: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: { blocks: true, team: true },
    });
    if (!project) throw new NotFoundException(`Project "${slug}" not found`);
    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const slug = slugify(dto.title, { lower: true });
    return this.prisma.project.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description ?? '', // Provide a default empty string if undefined
        thumbnail: dto.thumbnail,
        category: dto.category,
        blocks: {
          create: dto.blocks.map((b) => ({
            type: b.type,
            text: b.text,
            layout: b.layout,
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

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const data: any = {};

    if (dto.title) {
      data.title = dto.title;
      data.slug = slugify(dto.title, { lower: true });
    }
    if (dto.description !== undefined) data.description = dto.description; // Include description
    if (dto.thumbnail !== undefined) data.thumbnail = dto.thumbnail;
    if (dto.category !== undefined) data.category = dto.category;

    if (dto.blocks) {
      data.blocks = {
        deleteMany: {}, // clear existing
        create: dto.blocks.map((b) => ({
          type: b.type,
          text: b.text,
          layout: b.layout,
          src: b.src,
          alt: b.alt,
          data: b.data,
        })),
      };
    }

    if (dto.team) {
      data.team = {
        deleteMany: {}, // clear existing members
        create: dto.team.map((m) => ({ name: m.name, role: m.role })),
      };
    }

    return this.prisma.project.update({
      where: { id },
      data,
      include: { blocks: true, team: true },
    });
  }

  async remove(id: string) {
    try {
      const [ , , deletedProject ] = await this.prisma.$transaction([
        // 1) delete all content blocks for this project
        this.prisma.contentBlock.deleteMany({ where: { projectId: id } }),
        // 2) delete all team members for this project
        this.prisma.teamMember.deleteMany({ where: { projectId: id } }),
        // 3) finally delete the project itself
        this.prisma.project.delete({ where: { id } }),
      ]);

      return deletedProject;
    } catch (err: any) {
      // Prisma “record not found” error code on Mongo is P2025
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Project ${id} not found`);
      }
      // rethrow anything else (e.g. transient network errors)
      throw err;
    }
  }
}