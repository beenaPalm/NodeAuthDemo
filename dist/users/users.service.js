"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const app_constants_1 = require("../constants/app.constants");
const users_queries_1 = require("./users.queries");
const response_dto_1 = require("../constants/response.dto");
const app_messages_1 = require("../constants/app.messages");
let UsersService = class UsersService {
    constructor(userQueries, databaseService) {
        this.userQueries = userQueries;
        this.databaseService = databaseService;
    }
    async createUser(createUsersDto) {
        let keysUser = ['email', 'user_name', 'date_of_birth'];
        let valueUser = [createUsersDto.email,
        createUsersDto.user_name,
        createUsersDto.date_of_birth];
        valueUser = valueUser.map(i => "'" + i + "'");
        const hashPassword = await (0, app_constants_1.getSecurePassword)(createUsersDto.password);
        let keysPassword = ['password'];
        let valuePassword = [hashPassword];
        let keysDevice = ['device_uniqueid', 'device_type', 'device_os_version', 'device_company'];
        let valueDevice = [createUsersDto.device_uniqueid,
        createUsersDto.device_type,
        createUsersDto.device_os_version,
        createUsersDto.device_company];
        valueDevice = valueDevice.map(i => "'" + i + "'");
        let emailRegistered = await this.userQueries.queryUserEmailCheck(createUsersDto.email);
        if (emailRegistered) {
            return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Show_Error, app_messages_1.AppMessages.Msg_Err_Reg_Email_Already_Registerd, null);
        }
        let queryRunner = await this.databaseService.queryStartTrasaction();
        try {
            let res = await this.databaseService.queryInsert(queryRunner, app_constants_1.TableName.Table_Users, keysUser.join(','), valueUser.join(','));
            keysPassword = ['id_users', ...keysPassword];
            valuePassword = [res.insertId, ...valuePassword];
            valuePassword = valuePassword.map(i => "'" + i + "'");
            await this.databaseService.queryInsert(queryRunner, app_constants_1.TableName.Table_Passport, keysPassword.join(','), valuePassword.join(','));
            var deviceId = await this.userQueries.queryUserDeviceCheck(queryRunner, createUsersDto);
            if (deviceId == 0) {
                let resDevice = await this.databaseService.queryInsert(queryRunner, app_constants_1.TableName.Table_Devices_Info, keysDevice.join(','), valueDevice.join(','));
                deviceId = resDevice.insertId;
            }
            await this.userQueries.queryUserSessionUpdate(queryRunner, createUsersDto, res.insertId, deviceId);
            await this.databaseService.queryCommitTransaction(queryRunner);
            let queryString = {};
            queryString['id_users'] = res.insertId;
            let userInfo = await this.userQueries.querySelectSingleRow(app_constants_1.TableName.Table_Users, queryString);
            return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Success, app_messages_1.AppMessages.Msg_Succ_Regsiter, userInfo);
        }
        catch (err) {
            await this.databaseService.queryRollBackTransaction(queryRunner);
        }
        finally {
            await this.databaseService.queryReleaseQueryRunner(queryRunner);
        }
        return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Show_Error, app_messages_1.AppMessages.Msg_Err_Try_Again, null);
    }
    async getAllUsers() {
        let res = await this.userQueries.querySelectAll(app_constants_1.TableName.Table_Users);
        return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Success, app_messages_1.AppMessages.Msg_Succ_Users, res);
    }
    async getUserInfo(userId) {
        var queryString = {};
        queryString['id_users'] = userId;
        let res = await this.userQueries.querySelectSingleRow(app_constants_1.TableName.Table_Users, queryString);
        return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Success, app_messages_1.AppMessages.Msg_Succ_Users, res);
    }
    async loginUser(loginUser) {
        let password = await (0, app_constants_1.getSecurePassword)(loginUser.password);
        loginUser.password = password;
        let res = await this.userQueries.queryLoginInfoCheck(loginUser);
        if (res && res.length > 0) {
            return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Success, app_messages_1.AppMessages.Msg_Succ_Login, res);
        }
        else {
            return new response_dto_1.AppResponseDto(app_constants_1.StatusCode.Status_Show_Error, app_messages_1.AppMessages.Msg_Err_Login, res);
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_queries_1.UsersQueries, database_service_1.DatabaseService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map