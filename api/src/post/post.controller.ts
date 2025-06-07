import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '../auth/public.decorator'; // Import the Public decorator

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  

  @Get()
  @Public() // Mark this route as public
  async findAll() {
    return this.postService.findAll();
  }

  // Use slug for public route retrieval
  @Get(':slug')
  @Public()
  async findOne(@Param('slug') slug: string) {
    return this.postService.findOneBySlug(slug);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}