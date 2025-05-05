import { AssetService } from './asset.service';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    uploadFile(file: Express.Multer.File, caption: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }>;
    getAssets(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }[]>;
    updateAsset(id: string, updateData: {
        caption?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }>;
    deleteAsset(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        filename: string;
        caption: string | null;
    }>;
}
