import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StudioService } from './studio.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { Public } from '../auth/public.decorator';

@Controller('studios')
export class StudioController {
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
  async create(@Body() createStudioDto: CreateStudioDto) {
    return this.studioService.create(createStudioDto);
  }

  @Public()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudioDto: UpdateStudioDto) {
    return this.studioService.update(id, updateStudioDto);
  }
  
  

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studioService.delete(id);
  }
}