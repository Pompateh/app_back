import { NewsletterService } from './newsletter.service';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(body: {
        email: string;
    }): Promise<{
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
