import { Studio } from '@prisma/client';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
export declare class StudioService {
    constructor();
    private readonly prisma;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createStudioDto: CreateStudioDto): Promise<any>;
    update(id: string, updateStudioDto: UpdateStudioDto): Promise<Studio>;
    private parseJsonField;
    delete(id: string): Promise<any>;
}
