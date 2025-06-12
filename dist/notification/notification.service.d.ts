export declare class NotificationService {
    private prisma;
    logNotification(message: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string | null;
    }>;
    getAll(): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string | null;
    }[]>;
}
