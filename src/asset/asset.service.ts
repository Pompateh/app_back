import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AssetService {
  private prisma = new PrismaClient();

  async createAsset(data: { url: string; filename: string; caption?: string }) {
    return this.prisma.asset.create({ data });
  }

  async findAll() {
    return this.prisma.asset.findMany();
  }

  async updateAsset(id: string, updateData: { caption?: string }) {
    return this.prisma.asset.update({
      where: { id },
      data: updateData,
    });
  }

  async removeAsset(id: string) {
    return this.prisma.asset.delete({ where: { id } });
  }
}
