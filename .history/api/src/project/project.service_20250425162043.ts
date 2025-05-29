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

  async remove(id: string): Promise<Project> {
    try {
      return await this.prisma.project.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Project id ${id} not found`);
    }
  }
}