export declare class OrderService {
    private prisma;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
        userId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
        userId: string;
    } | null>;
    create(createDto: {
        orderRef: string;
        userId: string;
        total: number;
        status: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
        userId: string;
    }>;
    checkout(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderRef: string;
        customer: string;
        total: number;
        status: string;
        userId: string;
    }>;
}
