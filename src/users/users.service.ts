import { Response } from 'express';
import { ForgotPassDto } from './dtos/forgot_pass.dto';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../src/database/database.service';
import { comparePassword, generateRefreshToken, getSecurePassword, StatusCode, TableName } from '../../src/constants/app.constants';
import { LoginUsersDto } from './dtos/login_users.dto';
import { QueryRunner } from 'typeorm';
import { UsersQueries } from './users.queries';
import { AppResponseDto } from '../constants/response.dto';
import { AppMessages } from '../constants/app.messages';
import { CreateUsersDto } from './dtos/create_users.dto';
import { Users } from './entities/user.entities';
import { AuthService } from '../../src/auth/auth.service';


@Injectable()
export class UsersService {

    constructor(private userQueries: UsersQueries, private databaseService: DatabaseService,
        private authService: AuthService) { }

    async createUser(createUsersDto: CreateUsersDto) {
        let keysUser = ['email', 'user_name', 'date_of_birth']
        let valueUser = [createUsersDto.email,
        createUsersDto.user_name,
        createUsersDto.date_of_birth]
        valueUser = valueUser.map(i => "'" + i + "'");

        const hashPassword = await getSecurePassword(createUsersDto.password)

        let keysPassword = ['password']
        let valuePassword = [hashPassword]

        let emailRegistered: Boolean = await this.userQueries.queryUserEmailCheck(createUsersDto.email)
        if (emailRegistered) {

            return new AppResponseDto(StatusCode.Status_Show_Error,
                AppMessages.Msg_Err_Reg_Email_Already_Registerd,
                [])
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


            //Update device info of new login for multiple device handling purpose
            let responseToken = await this.updateDeviceSpecificUserInformation(queryRunner,
                createUsersDto.device_uniqueid, createUsersDto.device_type, createUsersDto.device_os_version,
                createUsersDto.device_company, createUsersDto.serial_no, res.insertId)


            await this.databaseService.queryCommitTransaction(queryRunner)

            let queryString = {}
            queryString['id_users'] = res.insertId
            let userInfo = await this.userQueries.querySelectSingleRow(TableName.Table_Users,
                queryString)

            let arrayResponse: Users[] = userInfo
            arrayResponse[0].refresh_token = responseToken.refresh_token
            arrayResponse[0].access_token = responseToken.access_token

            return new AppResponseDto(StatusCode.Status_Success,
                AppMessages.Msg_Succ_Regsiter,
                arrayResponse)

        } catch (err) {
            // if we have errors, rollback changes we made
            await this.databaseService.queryRollBackTransaction(queryRunner)

        } finally {
            // release query runner which is manually created:
            await this.databaseService.queryReleaseQueryRunner(queryRunner)
        }

        return new AppResponseDto(StatusCode.Status_Show_Error,
            AppMessages.Msg_Err_Try_Again,
            [])

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
        const queryRunner: QueryRunner = await this.databaseService.queryGetQueryRunner()

        let res = await this.userQueries.queryLoginInfoCheck(queryRunner, loginUser)
        if (res && res.length > 0) {
            let passwordCheck = await comparePassword(loginUser.password, res[0].password)
            if (passwordCheck) {
                delete res[0].password

                //Update device info of new login for multiple device handling purpose
                let responseToken = await this.updateDeviceSpecificUserInformation(queryRunner,
                    loginUser.device_uniqueid, loginUser.device_type, loginUser.device_os_version,
                    loginUser.device_company, loginUser.serial_no, res[0].id_users)
                await this.databaseService.queryReleaseQueryRunner(queryRunner)


                let arrayResponse: Users[] = res
                arrayResponse[0].refresh_token = responseToken.refresh_token
                arrayResponse[0].access_token = responseToken.access_token

                return new AppResponseDto(StatusCode.Status_Success,
                    AppMessages.Msg_Succ_Login,
                    arrayResponse)

            }
            else {
                await this.databaseService.queryReleaseQueryRunner(queryRunner)
                return new AppResponseDto(StatusCode.Status_Show_Error,
                    AppMessages.Msg_Err_Login,
                    [])
            }
        }
        else {
            await this.databaseService.queryReleaseQueryRunner(queryRunner)
            return new AppResponseDto(StatusCode.Status_Show_Error,
                AppMessages.Msg_Err_Login_User_Not_Registered,
                [])

        }
    }

    async forgotPassword(forgotPass: ForgotPassDto) {

        let queryRunner: QueryRunner = await this.databaseService.queryGetQueryRunner()
        let res = await this.userQueries.queryAddVerificationCode(queryRunner, forgotPass.email)

    }

    async updateDeviceSpecificUserInformation(queryRunner: QueryRunner,
        deviceUniqueid: string, deviceType: string, deviceOsVersion: string,
        deviceCompany: string, serialNo: string, userId: Number) {

        //Update device info of new login for multiple device handling purpose
        var deviceId = await this.userQueries.queryUserDeviceCheck(queryRunner,
            deviceUniqueid, deviceType, deviceOsVersion,
            deviceCompany)

        if (deviceId == 0) {

            let keysDevice = ['device_uniqueid', 'device_type', 'device_os_version', 'device_company']
            let valueDevice = [deviceUniqueid,
                deviceType,
                deviceOsVersion,
                deviceCompany]
            valueDevice = valueDevice.map(i => "'" + i + "'");

            let resDevice = await this.databaseService.queryInsert(queryRunner, TableName.Table_Devices_Info,
                keysDevice.join(','), valueDevice.join(','))
            deviceId = resDevice.insertId
        }

        var jsonPayload = {}
        jsonPayload['userId'] = userId
        jsonPayload['deviceId'] = deviceId
        jsonPayload['serialNo'] = serialNo
        jsonPayload['aud'] = "localhost"
        jsonPayload['iss'] = "localhost"


        let refreshToken: string = await generateRefreshToken(10);
        let accessToken: string = await this.authService.login(jsonPayload)

        await this.userQueries.queryUserSessionUpdate(queryRunner, refreshToken, accessToken, userId, deviceId, serialNo)
        return { 'access_token': accessToken, 'refresh_token': refreshToken }
    }

}

