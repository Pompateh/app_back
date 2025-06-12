import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectController {
    private readonly projectService;
    private readonly logger;
    constructor(projectService: ProjectService);
    findAll(): Promise<{
        status: string;
        data: ({
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
                navigation: import("@prisma/client/runtime/library").JsonValue | null;
                slogan: string | null;
                portfolio: import("@prisma/client/runtime/library").JsonValue | null;
                fonts: import("@prisma/client/runtime/library").JsonValue | null;
                artworks: import("@prisma/client/runtime/library").JsonValue | null;
            };
            blocks: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue | null;
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
        })[];
    }>;
    findOneBySlug(slug: string): Promise<{
        status: string;
        data: {
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
                navigation: import("@prisma/client/runtime/library").JsonValue | null;
                slogan: string | null;
                portfolio: import("@prisma/client/runtime/library").JsonValue | null;
                fonts: import("@prisma/client/runtime/library").JsonValue | null;
                artworks: import("@prisma/client/runtime/library").JsonValue | null;
            };
            blocks: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue | null;
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
        };
    }>;
    create(dto: CreateProjectDto): Promise<{
        status: string;
        message: string;
        data: {
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
                navigation: import("@prisma/client/runtime/library").JsonValue | null;
                slogan: string | null;
                portfolio: import("@prisma/client/runtime/library").JsonValue | null;
                fonts: import("@prisma/client/runtime/library").JsonValue | null;
                artworks: import("@prisma/client/runtime/library").JsonValue | null;
            };
            blocks: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue | null;
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
        };
    }>;
    update(id: string, dto: UpdateProjectDto): Promise<{
        status: string;
        message: string;
        data: {
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
                navigation: import("@prisma/client/runtime/library").JsonValue | null;
                slogan: string | null;
                portfolio: import("@prisma/client/runtime/library").JsonValue | null;
                fonts: import("@prisma/client/runtime/library").JsonValue | null;
                artworks: import("@prisma/client/runtime/library").JsonValue | null;
            };
            blocks: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue | null;
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
        };
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
}
