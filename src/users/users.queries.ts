import { Injectable } from '@nestjs/common';
import { generateRefreshToken, TableName } from '../../src/constants/app.constants';
import { DatabaseService } from '../../src/database/database.service';
import { InsertValuesMissingError, QueryRunner } from 'typeorm';
import { LoginUsersDto } from '../users/dtos/login_users.dto';
import * as moment from 'moment';



@Injectable()
export class UsersQueries {

    constructor(private databaseService: DatabaseService) {

    }

    findAll(): string {
        return `SELECT * FROM  ${TableName.Table_Users}`
    }

    findOne(id: number): string {
        return `SELECT * FROM ${TableName.Table_Users} where id_users = ${id}`
    }

    findUserLoggedIn() {

        return `SELECT u.*,p.password FROM ${TableName.Table_Users} u  LEFT JOIN "
        ${TableName.Table_Passport} " p ON p.id_users = u.id_users AND p.login_type =? 
         WHERE u.email=? AND u.user_status=1`;

    };


    checkUserEmail() {

        return `SELECT COUNT(id_users) as email_count FROM ${TableName.Table_Users} WHERE email=?`;
    };

    checkUserDevice() {

        return `SELECT id_devices FROM  ${TableName.Table_Devices_Info}  
        WHERE device_uniqueid=? AND device_type=? AND device_os_version=? AND device_company=?`
    };

    insertUser(keys: string, values: string) {

        return `INSERT INTO ${TableName.Table_Users} ${keys} values (${values})`;

    }



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

    async queryUserSessionUpdate(queryRunner: QueryRunner, refreshToken: string, accessToken: string, userId: Number,
        deviceId: Number, serialNo: string) {

        let keysDevice = ['id_users', 'id_devices', 'serial_no', 'refresh_token', 'access_token']
        let valueDevice = [userId, deviceId, serialNo, refreshToken, accessToken]
        valueDevice = valueDevice.map(i => "'" + i + "'");

        let queryInsert = "INSERT INTO " + TableName.Table_User_Session + " (" + keysDevice.join(',') + ") VALUES (" +
            valueDevice.join(',')
            + ")  ON DUPLICATE KEY UPDATE serial_no='" + serialNo + "',  refresh_token='" + refreshToken + "' , access_token='" + accessToken + "'"

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


    async queryAddVerificationCode(queryRunner: QueryRunner, email: string, verificationCode: string) {

        let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

        let keysDevice = ['email', 'verification_code', 'expired_time', 'total_verification']
        let valueDevice = [email, verificationCode, currentDate, 1]
        valueDevice = valueDevice.map(i => "'" + i + "'");
        try {
            let queryInsert = "INSERT INTO " + TableName.Table_Otp_Verification + " (" + keysDevice.join(',') + ") VALUES (" +
                valueDevice.join(',')
                + ")  ON DUPLICATE KEY UPDATE  verification_code='" + verificationCode +
                "', expired_time='" + currentDate + "' , total_verification=total_verification+1"

            const result = await queryRunner.query(queryInsert);
            console.log(result)
            return result
        }
        catch (err) {
            return null
        }

    };

}

