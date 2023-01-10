import { DatabaseService } from 'src/database/database.service';
import { LoginUsersDto } from './dtos/login_users.dto';
import { UsersQueries } from './users.queries';
import { AppResponseDto } from '../constants/response.dto';
import { CreateUsersDto } from './dtos/create_users.dto';
export declare class UsersService {
    private userQueries;
    private databaseService;
    constructor(userQueries: UsersQueries, databaseService: DatabaseService);
    createUser(createUsersDto: CreateUsersDto): Promise<AppResponseDto>;
    getAllUsers(): Promise<AppResponseDto>;
    getUserInfo(userId: Number): Promise<AppResponseDto>;
    loginUser(loginUser: LoginUsersDto): Promise<AppResponseDto>;
}
