import { StudioService } from './studio.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
export declare class StudioController {
    private readonly studioService;
    private readonly logger;
    constructor(studioService: StudioService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createStudioDto: CreateStudioDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    update(id: string, updateStudioDto: UpdateStudioDto): Promise<{
        status: string;
        message: string;
        data: {
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
    }>;
    delete(id: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
}
