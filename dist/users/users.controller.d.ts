import { LoginUsersDto } from './dtos/login_users.dto';
import { CreateUsersDto } from './dtos/create_users.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    create(createUserDto: CreateUsersDto): Promise<import("../constants/response.dto").AppResponseDto>;
    findAll(): Promise<import("../constants/response.dto").AppResponseDto>;
    findOne(id: number): Promise<import("../constants/response.dto").AppResponseDto>;
    loginUser(loginUser: LoginUsersDto): Promise<import("../constants/response.dto").AppResponseDto>;
}
