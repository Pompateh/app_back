"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const slugify_1 = require("slugify");
let PostService = class PostService {
    prisma = new client_1.PrismaClient();
    async findAll() {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return posts.map(post => ({
            ...post,
            additionalContent: typeof post.additionalContent === 'string'
                ? JSON.parse(post.additionalContent)
                : post.additionalContent,
        }));
    }
    async findOneBySlug(slug) {
        const post = await this.prisma.post.findUnique({ where: { slug } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        return {
            ...post,
            additionalContent: typeof post.additionalContent === 'string'
                ? JSON.parse(post.additionalContent)
                : post.additionalContent,
        };
    }
    async generateUniqueSlug(title) {
        const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;
        while (await this.prisma.post.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${count++}`;
        }
        return slug;
    }
    async create(createPostDto) {
        const slug = await this.generateUniqueSlug(createPostDto.title);
        return this.prisma.post.create({
            data: {
                ...createPostDto,
                slug,
                additionalContent: createPostDto.additionalContent ?? [],
            },
        });
    }
    async update(id, updatePostDto) {
        const existing = await this.prisma.post.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Post not found');
        return this.prisma.post.update({
            where: { id },
            data: {
                ...updatePostDto,
                version: existing.version + 1,
                isDraft: updatePostDto.published ? false : true,
                additionalContent: updatePostDto.additionalContent ?? [],
            },
        });
    }
    async remove(id) {
        try {
            return await this.prisma.post.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException(`Post with id ${id} not found`);
        }
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)()
], PostService);
//# sourceMappingURL=post.service.js.map