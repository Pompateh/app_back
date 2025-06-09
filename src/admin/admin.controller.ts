import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardData(@Req() req: any) {
    console.log('Fetching dashboard data for user:', req.user);
    return this.adminService.getDashboardStats();
  }

  @Get('studios')
  async getStudios() {
    return this.adminService.getStudios();
  }

  @Post('studios')
  async createStudio(@Body() data: any) {
    return this.adminService.createStudio(data);
  }

  @Put('studios/:id')
  async updateStudio(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateStudio(id, data);
  }

  @Delete('studios/:id')
  async deleteStudio(@Param('id') id: string) {
    return this.adminService.deleteStudio(id);
  }

  @Get('projects')
  async getProjects() {
    return this.adminService.getProjects();
  }

  @Post('projects')
  async createProject(@Body() data: any) {
    return this.adminService.createProject(data);
  }

  @Put('projects/:id')
  async updateProject(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProject(id, data);
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return this.adminService.deleteProject(id);
  }

  @Get('posts')
  async getPosts() {
    return this.adminService.getPosts();
  }

  @Post('posts')
  async createPost(@Body() data: any) {
    return this.adminService.createPost(data);
  }

  @Put('posts/:id')
  async updatePost(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePost(id, data);
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    return this.adminService.deletePost(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.adminService.uploadFile(file);
  }

  @Get('orders')
  async getOrders() {
    return this.adminService.getOrders();
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('newsletter')
  async getNewsletters() {
    return this.adminService.getNewsletters();
  }
} 