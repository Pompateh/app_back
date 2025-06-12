import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '../auth/public.decorator'; // Import the Public decorator
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Logger } from '@nestjs/common';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);

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
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto) {
    this.logger.log(`Creating post: ${JSON.stringify(createPostDto)}`);
    const result = await this.postService.create(createPostDto);
    return { status: 'success', message: 'Post created', data: result };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.logger.log(`Updating post ${id}: ${JSON.stringify(updatePostDto)}`);
    const result = await this.postService.update(id, updatePostDto);
    return { status: 'success', message: 'Post updated', data: result };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting post ${id}`);
    const result = await this.postService.remove(id);
    return { status: 'success', message: 'Post deleted', data: result };
  }
}