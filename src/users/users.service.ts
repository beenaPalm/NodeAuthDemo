import { ForgotPassDto } from './dtos/forgot_pass.dto';
import { Injectable } from '@nestjs/common';
import { DatabaseService, TransctionBlock } from '../../src/database/database.service';
import { comparePassword, generateRefreshToken, getSecurePassword, StatusCode, TableName } from '../../src/constants/app.constants';
import { LoginUsersDto } from './dtos/login_users.dto';
import { QueryRunner } from 'typeorm';
import { UsersQueries } from './users.queries';
import { CreateUsersDto } from './dtos/create_users.dto';
import { AuthService } from '../../src/auth/auth.service';
import { MailService } from '../../src/mail/mail.service';
import * as moment from 'moment';
import { Users } from './entities/user.entities';


@Injectable()
export class UsersService {

    constructor(private userQueries: UsersQueries, private databaseService: DatabaseService,
        private authService: AuthService, private mailService: MailService
    ) { }

    async createUser(createUsersDto: CreateUsersDto) {
        let keysUser = ['email', 'user_name', 'date_of_birth']
        let valueUser = [createUsersDto.email,
        createUsersDto.user_name,
        createUsersDto.date_of_birth]
        valueUser = valueUser.map(i => "'" + i + "'");

        const hashPassword = await getSecurePassword(createUsersDto.password)

        let keysPassword = ['password']
        let valuePassword = [hashPassword]

        let userInfo = await this.databaseService.findOne(this.userQueries.checkUserEmail(), [createUsersDto.email])

        if (!userInfo) {
            return null
        }
        let queryRunner: QueryRunner = await this.databaseService.queryStartTrasaction()

        try {
            let res = await this.databaseService.executeQuery(this.userQueries.insertData(TableName.Table_Users),
                [keysUser.join(','),
                valueUser.join(',')])

            keysPassword = ['id_users', ...keysPassword]
            valuePassword = [res.insertId, ...valuePassword]
            valuePassword = valuePassword.map(i => "'" + i + "'");


            await this.databaseService.executeQuery(this.userQueries.insertData(TableName.Table_Passport),
                [keysPassword.join(','),
                valuePassword.join(',')])



            //Update device info of new login for multiple device handling purpose
            let responseToken = await this.updateDeviceSpecificUserInformation(
                createUsersDto.device_uniqueid, createUsersDto.device_type, createUsersDto.device_os_version,
                createUsersDto.device_company, createUsersDto.serial_no, res.insertId)


            await this.databaseService.queryCommitTransaction(queryRunner)

            let userInfo = await await this.databaseService.findOne(this.userQueries.findOne(res.insertId))

            userInfo.refresh_token = responseToken.refresh_token
            userInfo.access_token = responseToken.access_token

            return userInfo as Users

        } catch (err) {
            // if we have errors, rollback changes we made
        } finally {
            // release query runner which is manually created:
        }

        return null

    }
    async getAllUsers() {

        return await this.databaseService.findAll(this.userQueries.findAll())

    }

    async getUserInfo(userId: number) {

        return await this.databaseService.findOne(this.userQueries.findOne(userId))

    }

    async loginUser(loginUser: LoginUsersDto) {
        console.log(loginUser)

        let loginRes = await this.databaseService.findOne(this.userQueries.findUserLoggedIn(),
            [loginUser.login_type, loginUser.email])
        console.log(loginRes)
        if (loginRes) {
            let passwordCheck = await comparePassword(loginUser.password, loginRes.password)
            if (passwordCheck) {
                delete loginRes.password

                //Update device info of new login for multiple device handling purpose
                let responseToken = await this.updateDeviceSpecificUserInformation(
                    loginUser.device_uniqueid, loginUser.device_type, loginUser.device_os_version,
                    loginUser.device_company, loginUser.serial_no, loginRes.id_users)

                loginRes.refresh_token = responseToken.refresh_token
                loginRes.access_token = responseToken.access_token

                return loginRes
            }
            else {
                return null
            }
        }
        return null
    }

    async forgotPassword(forgotPass: ForgotPassDto) {

        let verificationCode: string = await generateRefreshToken(6);

        let userInfo = await this.databaseService.findOne(this.userQueries.findOneByEmail(forgotPass.email))

        if (userInfo) {
            let responseMail = this.mailService.sendUserVerificationCode(userInfo, verificationCode)

            if (responseMail) {
                let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

                let keysDevice = ['email', 'verification_code', 'expired_time', 'total_verification']
                let valueDevice = [forgotPass.email, verificationCode, currentDate, 1]
                valueDevice = valueDevice.map(i => "'" + i + "'");

                return await this.databaseService.executeQuery(this.userQueries.insertUpdateAddVerificationCode(),
                    [keysDevice.join(','), valueDevice, verificationCode, currentDate])
            }
            else {
                return null
            }
        }
        else {
            return null
        }
    }


    async updateDeviceSpecificUserInformation(deviceUniqueid: string, deviceType: string, deviceOsVersion: string,
        deviceCompany: string, serialNo: string, userId: Number) {

        //Update device info of new login for multiple device handling purpose

        var deviceInfo = await this.databaseService.findOne(this.userQueries.checkUserDevice(),
            [deviceUniqueid, deviceType, deviceOsVersion,
                deviceCompany])

        let deviceId = deviceInfo.id_devices
        if (deviceInfo && deviceInfo.id_devices == 0) {

            let keysDevice = ['device_uniqueid', 'device_type', 'device_os_version', 'device_company']
            let valueDevice = [deviceUniqueid,
                deviceType,
                deviceOsVersion,
                deviceCompany]
            let resDevice = await this.databaseService.executeQuery(this.userQueries.insertData(TableName.Table_Devices_Info),
                [keysDevice.join(','),
                valueDevice.join(',')])

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


        let keysDevice = ['id_users', 'id_devices', 'serial_no', 'refresh_token', 'access_token']
        let valueDevice = [userId, deviceId, serialNo, refreshToken, accessToken]
        valueDevice = valueDevice.map(i => "'" + i + "'");


        await this.databaseService.executeQuery(this.userQueries.insertUpdateSessionInfo(), [keysDevice.join(','),
        valueDevice.join(','), serialNo, refreshToken, accessToken])
        return { 'access_token': accessToken, 'refresh_token': refreshToken }
    }

}

