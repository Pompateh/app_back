import { ConfigService } from '@nestjs/config';
export declare class UploadController {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
