import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardData(@Req() req: any) {
    console.log('Fetching dashboard data for user:', req.user);
    return this.adminService.getDashboardStats();
  }

  @Get('projects')
  async getProjects() {
    return this.adminService.getProjects();
  }

  @Get('studios')
  async getStudios() {
    return this.adminService.getStudios();
  }

  @Get('orders')
  async getOrders() {
    return this.adminService.getOrders();
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('posts')
  async getPosts() {
    return this.adminService.getPosts();
  }

  @Get('newsletter')
  async getNewsletters() {
    return this.adminService.getNewsletters();
  }
} 