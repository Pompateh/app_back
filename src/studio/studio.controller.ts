import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StudioService } from './studio.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller('studios')
export class StudioController {
  private readonly logger = new Logger(StudioController.name);

  constructor(private readonly studioService: StudioService) {}

  @Public()
  @Get()
  async findAll() {
    return this.studioService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studioService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createStudioDto: CreateStudioDto) {
    this.logger.log(`Creating studio: ${JSON.stringify(createStudioDto)}`);
    const result = await this.studioService.create(createStudioDto);
    return { status: 'success', message: 'Studio created', data: result };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateStudioDto: UpdateStudioDto) {
    this.logger.log(`Updating studio ${id}: ${JSON.stringify(updateStudioDto)}`);
    const result = await this.studioService.update(id, updateStudioDto);
    return { status: 'success', message: 'Studio updated', data: result };
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    this.logger.log(`Deleting studio ${id}`);
    const result = await this.studioService.delete(id);
    return { status: 'success', message: 'Studio deleted', data: result };
  }
}