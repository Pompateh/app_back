export declare class ShopService {
    private prisma;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        description: string;
        productId: string;
        imageUrl: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        description: string;
        productId: string;
        imageUrl: string;
    }>;
    create(createDto: {
        productId: string;
        title: string;
        description: string;
        price: number;
        image: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        description: string;
        productId: string;
        imageUrl: string;
    }>;
    update(id: string, updateDto: {
        title?: string;
        description?: string;
        price?: number;
        image?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        description: string;
        productId: string;
        imageUrl: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        description: string;
        productId: string;
        imageUrl: string;
    }>;
}
