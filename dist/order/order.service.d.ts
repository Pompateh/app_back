export declare class OrderService {
    private prisma;
    findAll(): Promise<({
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        project: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        projectId: string;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
    })[]>;
    findOne(id: string): Promise<({
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        project: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        projectId: string;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
    }) | null>;
    create(createDto: {
        orderRef: string;
        userId: string;
        projectId: string;
        total: number;
        status: string;
    }): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        project: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        projectId: string;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
    }>;
    remove(id: string): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        project: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        projectId: string;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
    }>;
    checkout(userId: string, projectId: string): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        project: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        projectId: string;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
    }>;
}
