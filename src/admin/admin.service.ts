import { Injectable } from '@nestjs/common';
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
              name: true,
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
        totalStudios,
        totalProjects,
        totalOrders,
        totalUsers,
        recentOrders,
        recentProjects,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Add your admin service methods here
} 