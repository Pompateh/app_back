"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const slugify_1 = require("slugify");
let ProjectService = class ProjectService {
    prisma = new client_1.PrismaClient();
    async findAll() {
        return this.prisma.project.findMany({ include: { blocks: true, team: true, studio: true } });
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { blocks: true, team: true, studio: true },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id ${id} not found`);
        }
        return project;
    }
    async findOneBySlug(slug) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
            include: { blocks: true, team: true, studio: true },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with slug "${slug}" not found`);
        }
        return project;
    }
    async create(dto) {
        const slug = (0, slugify_1.default)(dto.title, { lower: true });
        return this.prisma.project.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description || '',
                thumbnail: dto.thumbnail,
                category: dto.category,
                studio: {
                    connect: {
                        id: dto.studioId
                    }
                },
                user: {
                    connect: {
                        id: dto.userId
                    }
                },
                blocks: {
                    create: dto.blocks.map((b) => ({
                        type: b.type,
                        text: b.text,
                        layout: b.layout,
                        src: b.src,
                        alt: b.alt,
                        data: b.data,
                    })),
                },
                team: {
                    create: dto.team.map((m) => ({ name: m.name, role: m.role })),
                },
            },
            include: { blocks: true, team: true, studio: true, user: true },
        });
    }
    async update(id, dto) {
        const data = {};
        if (dto.title) {
            data.title = dto.title;
            data.slug = (0, slugify_1.default)(dto.title, { lower: true });
        }
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.thumbnail !== undefined)
            data.thumbnail = dto.thumbnail;
        if (dto.category !== undefined)
            data.category = dto.category;
        if (dto.studioId !== undefined) {
            data.studio = {
                connect: {
                    id: dto.studioId
                }
            };
        }
        if (dto.blocks) {
            data.blocks = {
                deleteMany: { projectId: id },
                create: dto.blocks.map((b) => ({
                    type: b.type,
                    text: b.text,
                    layout: b.layout,
                    src: b.src,
                    alt: b.alt,
                    data: b.data,
                })),
            };
        }
        if (dto.team) {
            data.team = {
                deleteMany: { projectId: id },
                create: dto.team.map((m) => ({ name: m.name, role: m.role })),
            };
        }
        try {
            return await this.prisma.project.update({
                where: { id },
                data,
                include: { blocks: true, team: true, studio: true },
            });
        }
        catch (err) {
            if (err.code === 'P2025') {
                throw new common_1.NotFoundException(`Project with id ${id} not found`);
            }
            throw err;
        }
    }
    async remove(id) {
        const [, , deletedProject] = await this.prisma.$transaction([
            this.prisma.contentBlock.deleteMany({ where: { projectId: id } }),
            this.prisma.teamMember.deleteMany({ where: { projectId: id } }),
            this.prisma.project.delete({ where: { id } }),
        ]);
        return deletedProject;
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)()
], ProjectService);
//# sourceMappingURL=project.service.js.map