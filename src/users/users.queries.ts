import { ConsoleLogger, Injectable } from '@nestjs/common';
import { TableName } from '../../src/constants/app.constants';
import { DatabaseService } from '../../src/database/database.service';
import { QueryRunner } from 'typeorm';
import { CreateUsersDto } from './dtos/create_users.dto';
import { LoginUsersDto } from './dtos/login_users.dto';



@Injectable()
export class UsersQueries {

    constructor(private databaseService: DatabaseService) {

    }

    async querySelectAll(tableName: string) {

        const queryRunner: QueryRunner = await this.databaseService.queryGetQueryRunner()
        const result = await queryRunner.query("SELECT * FROM " + tableName);
        this.databaseService.queryReleaseQueryRunner(queryRunner)
        return result
    }


    async querySelectSingleRow(tableName: string, queryObject: Object) {

        let entries = Object.entries(queryObject)
        let queryString = entries.map(([key, val]) => {
            return `${key} = '${val}' `;
        });
        let whereClause = queryString.join(' AND ')
        const queryRunner: QueryRunner = await this.databaseService.queryGetQueryRunner()
        const result = await queryRunner.query("SELECT * FROM " + tableName + " WHERE " + whereClause);
        this.databaseService.queryReleaseQueryRunner(queryRunner)
        return result
    }

    async queryLoginInfoCheck(queryRunner: QueryRunner, loginUser: LoginUsersDto) {


        let passQuery = "SELECT u.*,p.password FROM " + TableName.Table_Users + " u  LEFT JOIN "
            + TableName.Table_Passport + " p ON p.id_users = u.id_users AND p.login_type ='" +
            loginUser.login_type + "'  WHERE u.email='" + loginUser.email + "'";

        console.log(passQuery);

        try {
            const result = await queryRunner.query(passQuery);
            return result
        }
        catch (err) {
            if (err.code == 'ER_DUP_ENTRY') {

            }
        }
    };


    async queryUserEmailCheck(email: string) {
        const queryRunner: QueryRunner = await this.databaseService.queryGetQueryRunner()
        let passQuery = "SELECT COUNT(id_users) as email_count FROM " + TableName.Table_Users + " WHERE email='" + email + "'";
        const result = await queryRunner.query(passQuery);
        this.databaseService.queryReleaseQueryRunner(queryRunner)
        return (result && result.length > 0 && result[0].email_count > 0) ? true : false

    };


    async queryUserDeviceCheck(queryRunner: QueryRunner, deviceUniqueid: string,
        deviceType: string, deviceOsVersion: string, deviceCompany: string) {

        let passQuery = "SELECT id_devices FROM " + TableName.Table_Devices_Info +
            " WHERE device_uniqueid='" + deviceUniqueid + "' AND " +
            "device_type='" + deviceType + "' AND " +
            "device_os_version='" + deviceOsVersion + "' AND " +
            "device_company='" + deviceCompany + "'";
        const result = await queryRunner.query(passQuery);
        return (result && result.length > 0) ? result[0].id_devices : 0

    };

    async queryDeviceInfoInsert(queryRunner: QueryRunner, keysDevice: string, valueDevice: string) {

        try {
            await this.databaseService.queryInsert(queryRunner, TableName.Table_Devices_Info,
                keysDevice, valueDevice)
        }
        catch (err) {
            console.log(err)
        }

    };

    async queryUserSessionUpdate(queryRunner: QueryRunner, userId: Number, deviceId: Number) {

        let refresh_token = (Math.random() + 1).toString(36).substring(7);

        let keysDevice = ['id_users', 'id_devices', 'refresh_token']
        let valueDevice = [userId, deviceId, refresh_token]
        valueDevice = valueDevice.map(i => "'" + i + "'");

        let queryInsert = "INSERT INTO " + TableName.Table_User_Session + " (" + keysDevice.join(',') + ") VALUES (" +
            valueDevice.join(',')
            + ")  ON DUPLICATE KEY UPDATE  refresh_token='" + refresh_token + "'"

        const result = await queryRunner.query(queryInsert);

        return result


    };



    async queryInsertPasswordAndUpdateOnDuplicate(queryRunner: QueryRunner, tableName: string, keys: string, values: string,
        newPassword: string) {
        let queryStr = "INSERT INTO " + tableName + "(" + keys + ") values (" + values + ") ON DUPLICATE KEY UPDATE "
            + "password ='" + newPassword + "'";
        try {
            const result = await queryRunner.query(queryStr);
            return result
        }
        catch (err) {
            return null
        }
    };



}

