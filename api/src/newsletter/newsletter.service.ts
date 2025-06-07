import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NewsletterService {
  private prisma = new PrismaClient();

  async subscribe(email: string) {
    return this.prisma.newsletter.create({
      data: { email },
    });
  }

  async listSubscribers() {
    return this.prisma.newsletter.findMany();
  }

  async unsubscribe(id: string) {
    return this.prisma.newsletter.delete({
      where: { id },
    });
  }
}