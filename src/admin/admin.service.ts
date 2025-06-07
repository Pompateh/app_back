import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Studio } from '../studios/schemas/studio.schema';
import { Project } from '../projects/schemas/project.schema';
import { Order } from '../orders/schemas/order.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Studio.name) private studioModel: Model<Studio>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getDashboardStats() {
    try {
      // Get total counts
      const [totalStudios, totalProjects, totalOrders, totalUsers] = await Promise.all([
        this.studioModel.countDocuments(),
        this.projectModel.countDocuments(),
        this.orderModel.countDocuments(),
        this.userModel.countDocuments(),
      ]);

      // Get recent orders
      const recentOrders = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .lean();

      // Get recent projects with studio info
      const recentProjects = await this.projectModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('studio', 'name')
        .lean();

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
} 