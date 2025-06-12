import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard
  async getDashboardStats() {
    try {
      const [
        totalStudios,
        totalProjects,
        totalOrders,
        totalUsers,
        recentOrders,
        recentProjects
      ] = await Promise.all([
        this.prisma.studio.count(),
        this.prisma.project.count(),
        this.prisma.order.count(),
        this.prisma.user.count(),
        this.prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: true,
          },
        }),
        this.prisma.project.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            studio: true,
          },
        }),
      ]);

      return {
        totalStudios,
        totalProjects,
        totalOrders,
        totalUsers,
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          customerName: order.user.email,
          date: order.createdAt.toISOString(),
          status: order.status,
        })),
        recentProjects: recentProjects.map(project => ({
          id: project.id,
          name: project.title,
          date: project.createdAt.toISOString(),
          status: project.status || 'active',
          studio: project.studio.name,
        })),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new InternalServerErrorException('Failed to fetch dashboard statistics');
    }
  }

  // Studios
  async getStudios() {
    try {
      const studios = await this.prisma.studio.findMany({
        include: {
          _count: {
            select: {
              projects: true,
              artworks: true,
            },
          },
        },
      });
      return studios;
    } catch (error) {
      console.error('Error fetching studios:', error);
      throw new InternalServerErrorException('Failed to fetch studios');
    }
  }

  async createStudio(data: any) {
    try {
      const studio = await this.prisma.studio.create({
        data: {
          name: data.name,
          description: data.description,
          thumbnail: data.thumbnail,
          logo: data.logo,
          author: data.author,
          imageTitle: data.imageTitle,
          imageDescription: data.imageDescription,
          openDays: data.openDays,
          openHours: data.openHours,
          navigation: data.navigation,
          slogan: data.slogan,
          portfolio: {
            create: data.portfolio,
          },
          fonts: {
            create: data.fonts,
          },
          artworks: {
            create: data.artworks,
          },
        },
      });
      return studio;
    } catch (error) {
      console.error('Error creating studio:', error);
      throw new InternalServerErrorException('Failed to create studio');
    }
  }

  async updateStudio(id: string, data: any) {
    try {
      const studio = await this.prisma.studio.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          thumbnail: data.thumbnail,
          logo: data.logo,
          author: data.author,
          imageTitle: data.imageTitle,
          imageDescription: data.imageDescription,
          openDays: data.openDays,
          openHours: data.openHours,
          navigation: data.navigation,
          slogan: data.slogan,
          portfolio: {
            deleteMany: {},
            create: data.portfolio,
          },
          fonts: {
            deleteMany: {},
            create: data.fonts,
          },
          artworks: {
            deleteMany: {},
            create: data.artworks,
          },
        },
      });
      return studio;
    } catch (error) {
      console.error('Error updating studio:', error);
      throw new InternalServerErrorException('Failed to update studio');
    }
  }

  async deleteStudio(id: string) {
    try {
      await this.prisma.studio.delete({
        where: { id },
      });
      return { message: 'Studio deleted successfully' };
    } catch (error) {
      console.error('Error deleting studio:', error);
      throw new InternalServerErrorException('Failed to delete studio');
    }
  }

  // Projects
  async getProjects() {
    try {
      const projects = await this.prisma.project.findMany({
        include: {
          studio: true,
          user: true,
        },
      });
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  async createProject(data: any) {
    try {
      const project = await this.prisma.project.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || '',
          category: data.category,
          thumbnail: data.thumbnail,
          content: data.content,
          studio: {
            connect: { id: data.studioId }
          },
          user: {
            connect: { id: data.userId }
          }
        },
      });
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async updateProject(id: string, data: any) {
    try {
      const project = await this.prisma.project.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          category: data.category,
          thumbnail: data.thumbnail,
          content: data.content,
          studioId: data.studioId,
          userId: data.userId,
        },
      });
      return project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  async deleteProject(id: string) {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
      return { message: 'Project deleted successfully' };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new InternalServerErrorException('Failed to delete project');
    }
  }

  // Posts
  async getPosts() {
    try {
      const posts = await this.prisma.post.findMany({
        include: {
          author: true,
        },
      });
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async createPost(data: any) {
    try {
      const post = await this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          authorId: data.authorId
        },
      });
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async updatePost(id: string, data: any) {
    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          authorId: data.authorId
        },
      });
      return post;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  async deletePost(id: string) {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
      return { message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new InternalServerErrorException('Failed to delete post');
    }
  }

  // File Upload
  async uploadFile(file: Express.Multer.File) {
    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, file.buffer);
      
      return {
        url: `/uploads/${fileName}`,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  // Other endpoints
  async getOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          user: true,
          project: {
            include: {
              studio: true,
            },
          },
        },
      });
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          _count: {
            select: {
              orders: true,
              projects: true,
            },
          },
        },
      });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getNewsletters() {
    try {
      const newsletters = await this.prisma.newsletter.findMany();
      return newsletters;
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      throw new InternalServerErrorException('Failed to fetch newsletters');
    }
  }
} 