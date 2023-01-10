import { DatabaseService } from '../../src/database/database.service';
import { QueryRunner } from 'typeorm';
import { CreateUsersDto } from './dtos/create_users.dto';
import { LoginUsersDto } from './dtos/login_users.dto';
export declare class UsersQueries {
    private databaseService;
    constructor(databaseService: DatabaseService);
    querySelectAll(tableName: string): Promise<any>;
    querySelectSingleRow(tableName: string, queryObject: Object): Promise<any>;
    queryLoginInfoCheck(loginUser: LoginUsersDto): Promise<any>;
    queryUserEMailCheck(email: string): Promise<boolean>;
    queryUserDeviceCheck(queryRunner: QueryRunner, userDto: CreateUsersDto): Promise<any>;
    queryDeviceInfoInsert(queryRunner: QueryRunner, keysDevice: string, valueDevice: string): Promise<void>;
    queryUserSessionUpdate(queryRunner: QueryRunner, userObj: CreateUsersDto, userId: Number, deviceId: Number): Promise<any>;
    queryInsertPasswordAndUpdateOnDuplicate(queryRunner: QueryRunner, tableName: string, keys: string, values: string, newPassword: string): Promise<any>;
}
