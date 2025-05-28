"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let StudioService = class StudioService {
    prisma = new client_1.PrismaClient();
    async findAll() {
        try {
            const studios = await this.prisma.studio.findMany();
            const sanitizedStudios = studios.map((studio) => ({
                ...studio,
                openHours: studio.openHours || 'N/A',
            }));
            console.log('Fetched Studios:', sanitizedStudios);
            return sanitizedStudios;
        }
        catch (error) {
            console.error('Error in findAll:', error.message);
            console.error('Stack Trace:', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch studios');
        }
    }
    async findOne(id) {
        try {
            const studio = await this.prisma.studio.findUnique({
                where: { id },
            });
            if (!studio) {
                throw new common_1.NotFoundException('Studio not found');
            }
            return studio;
        }
        catch (error) {
            console.error('Error in findOne:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch studio');
        }
    }
    async create(createStudioDto) {
        try {
            return this.prisma.studio.create({
                data: {
                    name: createStudioDto.name,
                    description: createStudioDto.description,
                    thumbnail: createStudioDto.thumbnail,
                    logo: createStudioDto.logo,
                    author: createStudioDto.author,
                    imageDescription: createStudioDto.imageDescription,
                    imageTitle: createStudioDto.imageTitle,
                    openDays: createStudioDto.openDays || [],
                    openHours: createStudioDto.openHours,
                    navigation: createStudioDto.navigation && createStudioDto.navigation.length > 0
                        ? createStudioDto.navigation
                        : undefined,
                },
            });
        }
        catch (error) {
            console.error('Error in create:', error.message);
            throw new common_1.InternalServerErrorException('Failed to create studio');
        }
    }
    async update(id, updateStudioDto) {
        try {
            const studio = await this.prisma.studio.update({
                where: { id },
                data: {
                    name: updateStudioDto.name,
                    description: updateStudioDto.description,
                    thumbnail: updateStudioDto.thumbnail,
                    logo: updateStudioDto.logo,
                    author: updateStudioDto.author,
                    imageTitle: updateStudioDto.imageTitle,
                    imageDescription: updateStudioDto.imageDescription,
                    openDays: updateStudioDto.openDays,
                    openHours: updateStudioDto.openHours,
                    slogan: updateStudioDto.slogan,
                    navigation: this.parseJsonField(updateStudioDto.navigation),
                    portfolio: this.parseJsonField(updateStudioDto.portfolio),
                    fonts: this.parseJsonField(updateStudioDto.fonts),
                    artworks: this.parseJsonField(updateStudioDto.artworks),
                },
            });
            return studio;
        }
        catch (error) {
            console.error('Error in update:', error);
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Studio not found');
            }
            throw new common_1.InternalServerErrorException('Failed to update studio');
        }
    }
    parseJsonField(field) {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field.trim());
            }
            catch (error) {
                console.error('Error parsing JSON field:', error);
                return undefined;
            }
        }
        return field;
    }
    async delete(id) {
        try {
            const studio = await this.prisma.studio.delete({
                where: { id },
            });
            return studio;
        }
        catch (error) {
            console.error('Error in delete:', error);
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Studio not found');
            }
            throw new common_1.InternalServerErrorException('Failed to delete studio');
        }
    }
};
exports.StudioService = StudioService;
exports.StudioService = StudioService = __decorate([
    (0, common_1.Injectable)()
], StudioService);
//# sourceMappingURL=studio.service.js.map