import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { getSecurePassword, StatusCode, TableName } from 'src/constants/app.constants';
import { LoginUsersDto } from './dtos/login_users.dto';
import { QueryRunner } from 'typeorm';
import { UsersQueries } from './users.queries';
import { AppResponseDto } from '../constants/response.dto';
import { AppMessages } from '../constants/app.messages';

import { CreateUsersDto } from './dtos/create_users.dto';



@Injectable()
export class UsersService {

    constructor(private userQueries: UsersQueries, private databaseService: DatabaseService) { }



    async createUser(createUsersDto: CreateUsersDto) {
        let keysUser = ['email', 'user_name', 'date_of_birth']
        let valueUser = [createUsersDto.email,
        createUsersDto.user_name,
        createUsersDto.date_of_birth]
        valueUser = valueUser.map(i => "'" + i + "'");


        const hashPassword = await getSecurePassword(createUsersDto.password)

        let keysPassword = ['password']
        let valuePassword = [hashPassword]

        let keysDevice = ['device_uniqueid', 'device_type', 'device_os_version', 'device_company']
        let valueDevice = [createUsersDto.device_uniqueid,
        createUsersDto.device_type,
        createUsersDto.device_os_version,
        createUsersDto.device_company]
        valueDevice = valueDevice.map(i => "'" + i + "'");

        let emailRegistered: Boolean = await this.userQueries.queryUserEMailCheck(createUsersDto.email)
        if (emailRegistered) {

            return new AppResponseDto(StatusCode.Status_Show_Error,
                AppMessages.Msg_Err_Reg_Email_Already_Registerd,
                null)
        }
        let queryRunner: QueryRunner = await this.databaseService.queryStartTrasaction()

        try {

            let res = await this.databaseService.queryInsert(queryRunner,
                TableName.Table_Users, keysUser.join(','), valueUser.join(','))

            keysPassword = ['id_users', ...keysPassword]
            valuePassword = [res.insertId, ...valuePassword]
            valuePassword = valuePassword.map(i => "'" + i + "'");

            await this.databaseService.queryInsert(queryRunner, TableName.Table_Passport,
                keysPassword.join(','), valuePassword.join(','))


            var deviceId = await this.userQueries.queryUserDeviceCheck(queryRunner, createUsersDto)
            if (deviceId == 0) {
                let resDevice = await this.databaseService.queryInsert(queryRunner, TableName.Table_Devices_Info,
                    keysDevice.join(','), valueDevice.join(','))
                deviceId = res.insertId
            }

            await this.userQueries.queryUserSessionUpdate(queryRunner, createUsersDto, res.insertId, deviceId)

            return new AppResponseDto(StatusCode.Status_Show_Error,
                AppMessages.Msg_Err_Try_Again,
                null)
            await this.databaseService.queryCommitTransaction(queryRunner)

            let queryString = {}
            queryString['id_users'] = res.insertId
            let userInfo = await this.userQueries.querySelectSingleRow(TableName.Table_Users,
                queryString)


            return new AppResponseDto(StatusCode.Status_Success,
                AppMessages.Msg_Succ_Regsiter,
                userInfo)


        } catch (err) {
            // if we have errors, rollback changes we made
            await this.databaseService.queryRollBackTransaction(queryRunner)

        } finally {
            // release query runner which is manually created:
            await this.databaseService.queryReleaseQueryRunner(queryRunner)
        }

        return new AppResponseDto(StatusCode.Status_Show_Error,
            AppMessages.Msg_Err_Try_Again,
            null)

    }
    async getAllUsers() {

        let res = await this.userQueries.querySelectAll(TableName.Table_Users)


        return new AppResponseDto(StatusCode.Status_Success,
            AppMessages.Msg_Succ_Users,
            res)
    }

    async getUserInfo(userId: Number) {

        var queryString = {}
        queryString['id_users'] = userId

        let res = await this.userQueries.querySelectSingleRow(TableName.Table_Users, queryString)
        return new AppResponseDto(StatusCode.Status_Success,
            AppMessages.Msg_Succ_Users,
            res)

    }

    async loginUser(loginUser: LoginUsersDto) {

        let password = await getSecurePassword(loginUser.password)

        loginUser.password = password
        let res = await this.userQueries.queryLoginInfoCheck(loginUser)

        if (res && res.length > 0) {
            return new AppResponseDto(StatusCode.Status_Success,
                AppMessages.Msg_Succ_Login,
                res)

        }
        else {
            return new AppResponseDto(StatusCode.Status_Show_Error,
                AppMessages.Msg_Err_Login,
                res)

        }


    }
}

