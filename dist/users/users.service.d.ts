import { DatabaseService } from 'src/database/database.service';
import { CreateUsersDto } from './dtos/create_users.dto';
export declare class UsersService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    createUser(createUsersDto: CreateUsersDto): Promise<{}>;
    getAllUsers(): Promise<{}>;
    getUserInfo(userId: Number): Promise<{}>;
}
