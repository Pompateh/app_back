export declare class NewsletterService {
    private prisma;
    subscribe(email: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
    listSubscribers(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }[]>;
    unsubscribe(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
    }>;
}
