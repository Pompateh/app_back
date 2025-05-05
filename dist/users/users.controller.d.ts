import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    getProfile(id: string): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
    updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
    deleteUser(id: string): Promise<{
        email: string;
        role: string;
        id: string;
    }>;
}
