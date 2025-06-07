import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationService {
  private prisma = new PrismaClient();

  async logNotification(message: string, userId?: string) {
    return this.prisma.notification.create({
      data: { message, userId },
    });
  }

  async getAll() {
    return this.prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
