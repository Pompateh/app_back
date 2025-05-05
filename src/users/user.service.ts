import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();
  private readonly saltRounds = 10;

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || 'user', // default role
      },
    });
    return { id: user.id, email: user.email, role: user.role };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true }, // never expose the password
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };
    // If password is provided, hash it
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true },
    });
    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true, role: true },
    });
    return user;
  }
}
