import { Prisma } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectService {
    private prisma;
    findAll(): Promise<({
        studio: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            author: string | null;
            description: string | null;
            thumbnail: string | null;
            logo: string | null;
            imageDescription: string | null;
            imageTitle: string | null;
            openDays: string[];
            openHours: string | null;
            navigation: Prisma.JsonValue | null;
            slogan: string | null;
            portfolio: Prisma.JsonValue | null;
            fonts: Prisma.JsonValue | null;
            artworks: Prisma.JsonValue | null;
        };
        blocks: {
            id: string;
            data: Prisma.JsonValue | null;
            type: import(".prisma/client").$Enums.BlockType;
            text: string | null;
            layout: import(".prisma/client").$Enums.Layout | null;
            src: string | null;
            alt: string | null;
            projectId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        slug: string;
        category: string | null;
        content: string | null;
        studioId: string;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        studio: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            author: string | null;
            description: string | null;
            thumbnail: string | null;
            logo: string | null;
            imageDescription: string | null;
            imageTitle: string | null;
            openDays: string[];
            openHours: string | null;
            navigation: Prisma.JsonValue | null;
            slogan: string | null;
            portfolio: Prisma.JsonValue | null;
            fonts: Prisma.JsonValue | null;
            artworks: Prisma.JsonValue | null;
        };
        blocks: {
            id: string;
            data: Prisma.JsonValue | null;
            type: import(".prisma/client").$Enums.BlockType;
            text: string | null;
            layout: import(".prisma/client").$Enums.Layout | null;
            src: string | null;
            alt: string | null;
            projectId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        slug: string;
        category: string | null;
        content: string | null;
        studioId: string;
        userId: string;
    }>;
    findOneBySlug(slug: string): Promise<{
        studio: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            author: string | null;
            description: string | null;
            thumbnail: string | null;
            logo: string | null;
            imageDescription: string | null;
            imageTitle: string | null;
            openDays: string[];
            openHours: string | null;
            navigation: Prisma.JsonValue | null;
            slogan: string | null;
            portfolio: Prisma.JsonValue | null;
            fonts: Prisma.JsonValue | null;
            artworks: Prisma.JsonValue | null;
        };
        blocks: {
            id: string;
            data: Prisma.JsonValue | null;
            type: import(".prisma/client").$Enums.BlockType;
            text: string | null;
            layout: import(".prisma/client").$Enums.Layout | null;
            src: string | null;
            alt: string | null;
            projectId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        slug: string;
        category: string | null;
        content: string | null;
        studioId: string;
        userId: string;
    }>;
    create(dto: CreateProjectDto): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        studio: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            author: string | null;
            description: string | null;
            thumbnail: string | null;
            logo: string | null;
            imageDescription: string | null;
            imageTitle: string | null;
            openDays: string[];
            openHours: string | null;
            navigation: Prisma.JsonValue | null;
            slogan: string | null;
            portfolio: Prisma.JsonValue | null;
            fonts: Prisma.JsonValue | null;
            artworks: Prisma.JsonValue | null;
        };
        blocks: {
            id: string;
            data: Prisma.JsonValue | null;
            type: import(".prisma/client").$Enums.BlockType;
            text: string | null;
            layout: import(".prisma/client").$Enums.Layout | null;
            src: string | null;
            alt: string | null;
            projectId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        slug: string;
        category: string | null;
        content: string | null;
        studioId: string;
        userId: string;
    }>;
    update(id: string, dto: UpdateProjectDto): Promise<{
        studio: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            author: string | null;
            description: string | null;
            thumbnail: string | null;
            logo: string | null;
            imageDescription: string | null;
            imageTitle: string | null;
            openDays: string[];
            openHours: string | null;
            navigation: Prisma.JsonValue | null;
            slogan: string | null;
            portfolio: Prisma.JsonValue | null;
            fonts: Prisma.JsonValue | null;
            artworks: Prisma.JsonValue | null;
        };
        blocks: {
            id: string;
            data: Prisma.JsonValue | null;
            type: import(".prisma/client").$Enums.BlockType;
            text: string | null;
            layout: import(".prisma/client").$Enums.Layout | null;
            src: string | null;
            alt: string | null;
            projectId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        slug: string;
        category: string | null;
        content: string | null;
        studioId: string;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        slug: string;
        category: string | null;
        content: string | null;
        studioId: string;
        userId: string;
    }>;
}
