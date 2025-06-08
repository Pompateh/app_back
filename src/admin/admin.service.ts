import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    try {
      // Get total counts
      const [totalStudios, totalProjects, totalOrders, totalUsers] = await Promise.all([
        this.prisma.studio.count(),
        this.prisma.project.count(),
        this.prisma.order.count(),
        this.prisma.user.count(),
      ]);

      // Get recent orders with user info
      const recentOrders = await this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      // Get recent projects with studio info
      const recentProjects = await this.prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          studio: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        status: 'success',
        data: {
          totalStudios,
          totalProjects,
          totalOrders,
          totalUsers,
          recentOrders,
          recentProjects,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new InternalServerErrorException('Failed to fetch dashboard statistics');
    }
  }

  async getProjects() {
    try {
      const projects = await this.prisma.project.findMany({
        include: {
          studio: {
            select: {
              name: true,
            },
          },
        },
      });
      return { status: 'success', data: projects };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  async getStudios() {
    try {
      const studios = await this.prisma.studio.findMany();
      return { status: 'success', data: studios };
    } catch (error) {
      console.error('Error fetching studios:', error);
      throw new InternalServerErrorException('Failed to fetch studios');
    }
  }

  async getOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
      return { status: 'success', data: orders };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      return { status: 'success', data: users };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getPosts() {
    try {
      const posts = await this.prisma.post.findMany();
      return { status: 'success', data: posts };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async getNewsletters() {
    try {
      const newsletters = await this.prisma.newsletter.findMany();
      return { status: 'success', data: newsletters };
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      throw new InternalServerErrorException('Failed to fetch newsletters');
    }
  }

  // Add your admin service methods here
} 