import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Public()
  async findAll() {
    try {
      const projects = await this.projectService.findAll();
      return { status: 'success', data: projects };
    } catch (error) {
      this.logger.error('Error fetching projects:', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  @Get(':slug')
  @Public()
  async findOneBySlug(@Param('slug') slug: string) {
    try {
      const project = await this.projectService.findOneBySlug(slug);
      return { status: 'success', data: project };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching project with slug ${slug}:`, error);
      throw new InternalServerErrorException('Failed to fetch project');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: CreateProjectDto) {
    try {
      this.logger.log(`Creating project: ${JSON.stringify(dto)}`);
      const result = await this.projectService.create(dto);
      return { status: 'success', message: 'Project created', data: result };
    } catch (error) {
      this.logger.error('Error creating project:', error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    try {
      this.logger.log(`Updating project ${id}: ${JSON.stringify(dto)}`);
      const result = await this.projectService.update(id, dto);
      return { status: 'success', message: 'Project updated', data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating project ${id}:`, error);
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting project with id: ${id}`);
      const result = await this.projectService.remove(id);
      return { status: 'success', message: 'Project deleted', data: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting project ${id}:`, error);
      throw new InternalServerErrorException('Failed to delete project');
    }
  }
}