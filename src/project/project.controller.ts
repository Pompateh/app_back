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
    return this.projectService.findAll();
  }

  @Get(':slug')
  @Public()
  async findOneBySlug(@Param('slug') slug: string) {
    return this.projectService.findOneBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: CreateProjectDto) {
    this.logger.log(`Creating project: ${JSON.stringify(dto)}`);
    const result = await this.projectService.create(dto);
    return { status: 'success', message: 'Project created', data: result };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    this.logger.log(`Updating project ${id}: ${JSON.stringify(dto)}`);
    const result = await this.projectService.update(id, dto);
    return { status: 'success', message: 'Project updated', data: result };
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    this.logger.log(`Deleting project with id: ${id}`);
    const result = this.projectService.remove(id);
    return { status: 'success', message: 'Project deleted', data: result };
  }
  

}