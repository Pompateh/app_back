import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import slugify from 'slugify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  private prisma = new PrismaClient();

  async findAll() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(post => ({
      ...post,
      additionalContent:
        typeof post.additionalContent === 'string'
          ? JSON.parse(post.additionalContent)
          : post.additionalContent,
    }));
  }

  async findOneBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException('Post not found');

    return {
      ...post,
      additionalContent:
        typeof post.additionalContent === 'string'
          ? JSON.parse(post.additionalContent)
          : post.additionalContent,
    };
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await this.prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }
    return slug;
  }

  async create(createPostDto: CreatePostDto) {
    const slug = await this.generateUniqueSlug(createPostDto.title);
    // Pass the raw array—no stringify:
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        slug,
        additionalContent: createPostDto.additionalContent ?? [],
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Post not found');

    return this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
        version: existing.version + 1,
        isDraft: updatePostDto.published ? false : true,
        // Raw array here as well:
        additionalContent: updatePostDto.additionalContent ?? [],
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.post.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
