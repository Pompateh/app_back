import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SettingService {
  private prisma = new PrismaClient();

  async getAll() {
    return this.prisma.setting.findMany();
  }

  async getSetting(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async updateSetting(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
