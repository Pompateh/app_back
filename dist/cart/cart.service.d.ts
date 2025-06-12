export declare class CartService {
    private prisma;
    addItem(userId: string, productId: string, quantity?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }>;
    updateItem(itemId: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }>;
    getCart(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        quantity: number;
    }[]>;
    clearCart(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
