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
exports.UsersQueries = void 0;
const common_1 = require("@nestjs/common");
const app_constants_1 = require("../constants/app.constants");
const database_service_1 = require("../database/database.service");
let UsersQueries = class UsersQueries {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async querySelectAll(tableName) {
        const queryRunner = await this.databaseService.queryGetQueryRunner();
        const result = await queryRunner.query("SELECT * FROM " + tableName);
        this.databaseService.queryReleaseQueryRunner(queryRunner);
        return result;
    }
    async querySelectSingleRow(tableName, queryObject) {
        let entries = Object.entries(queryObject);
        let queryString = entries.map(([key, val]) => {
            return `${key} = '${val}' `;
        });
        let whereClause = queryString.join(' AND ');
        const queryRunner = await this.databaseService.queryGetQueryRunner();
        const result = await queryRunner.query("SELECT * FROM " + tableName + " WHERE " + whereClause);
        this.databaseService.queryReleaseQueryRunner(queryRunner);
        return result;
    }
    async queryLoginInfoCheck(loginUser) {
        const queryRunner = await this.databaseService.queryGetQueryRunner();
        let passQuery = "SELECT u.* FROM " + app_constants_1.TableName.Table_Users + " u  LEFT JOIN "
            + app_constants_1.TableName.Table_Passport + " p ON p.id_users = p.id_users AND p.login_type ='" +
            loginUser.login_type + "'  WHERE u.email='" + loginUser.email + "' AND p.password = '" + loginUser.password + "'";
        console.log(passQuery);
        try {
            const result = await queryRunner.query(passQuery);
            return result;
        }
        catch (err) {
            if (err.code == 'ER_DUP_ENTRY') {
            }
        }
    }
    ;
    async queryUserEmailCheck(email) {
        const queryRunner = await this.databaseService.queryGetQueryRunner();
        let passQuery = "SELECT COUNT(id_users) as email_count FROM " + app_constants_1.TableName.Table_Users + " WHERE email='" + email + "'";
        const result = await queryRunner.query(passQuery);
        this.databaseService.queryReleaseQueryRunner(queryRunner);
        return (result && result.length > 0 && result[0].email_count > 0) ? true : false;
    }
    ;
    async queryUserDeviceCheck(queryRunner, userDto) {
        let passQuery = "SELECT id_devices FROM " + app_constants_1.TableName.Table_Devices_Info +
            " WHERE device_uniqueid='" + userDto.device_uniqueid + "' AND " +
            "device_type='" + userDto.device_type + "' AND " +
            "device_os_version='" + userDto.device_os_version + "' AND " +
            "device_company='" + userDto.device_company + "'";
        const result = await queryRunner.query(passQuery);
        return (result && result.length > 0) ? result[0].id_devices : 0;
    }
    ;
    async queryDeviceInfoInsert(queryRunner, keysDevice, valueDevice) {
        try {
            await this.databaseService.queryInsert(queryRunner, app_constants_1.TableName.Table_Devices_Info, keysDevice, valueDevice);
        }
        catch (err) {
            console.log(err);
        }
    }
    ;
    async queryUserSessionUpdate(queryRunner, userObj, userId, deviceId) {
        let refresh_token = (Math.random() + 1).toString(36).substring(7);
        let keysDevice = ['id_users', 'id_devices', 'refresh_token'];
        let valueDevice = [userId, deviceId, refresh_token];
        valueDevice = valueDevice.map(i => "'" + i + "'");
        let queryInsert = "INSERT INTO " + app_constants_1.TableName.Table_User_Session + " (" + keysDevice.join(',') + ") VALUES (" +
            valueDevice.join(',')
            + ")  ON DUPLICATE KEY UPDATE  refresh_token='" + refresh_token + "'";
        console.log(queryInsert);
        const result = await queryRunner.query(queryInsert);
        console.log(result);
        return result;
    }
    ;
    async queryInsertPasswordAndUpdateOnDuplicate(queryRunner, tableName, keys, values, newPassword) {
        let queryStr = "INSERT INTO " + tableName + "(" + keys + ") values (" + values + ") ON DUPLICATE KEY UPDATE "
            + "password ='" + newPassword + "'";
        try {
            const result = await queryRunner.query(queryStr);
            return result;
        }
        catch (err) {
            return null;
        }
    }
    ;
};
UsersQueries = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersQueries);
exports.UsersQueries = UsersQueries;
//# sourceMappingURL=users.queries.js.map