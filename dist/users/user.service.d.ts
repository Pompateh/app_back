import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private prisma;
    private readonly saltRounds;
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    findOne(id: string): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
    findByEmail(email: string): Promise<{
        username: string;
        email: string;
        password: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
    remove(id: string): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
}
