import { CreateUsersDto } from './dtos/create_users.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    create(createUserDto: CreateUsersDto): Promise<{}>;
    findAll(): Promise<{}>;
    findOne(id: number): Promise<{}>;
}
