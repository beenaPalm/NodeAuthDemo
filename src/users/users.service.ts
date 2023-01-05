import { Injectable, UseFilters } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TableName, formatResponse } from 'src/constants/app.constants';
import { CreateUsersDto } from './dtos/create_users.dto';
import * as bcrypt from 'bcrypt';
import { QueryRunner } from 'typeorm';



@Injectable()
export class UsersService {

    constructor(private databaseService: DatabaseService) { }


    async createUser(createUsersDto: CreateUsersDto) {
        let keysUser = ['email', 'user_name', 'date_of_birth']
        let valueUser = [createUsersDto.email,
        createUsersDto.user_name,
        createUsersDto.date_of_birth]
        valueUser = valueUser.map(i => "'" + i + "'");


        let keysPassword = ['password']

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(createUsersDto.password, saltOrRounds);

        let valuePassword = [hash]

        let keysDevice = ['device_uniqueid', 'device_type', 'device_os_version', 'device_company']
        let valueDevice = [createUsersDto.device_uniqueid,
        createUsersDto.device_type,
        createUsersDto.device_os_version,
        createUsersDto.device_company]
        valueDevice = valueDevice.map(i => "'" + i + "'");


        let queryRunner: QueryRunner = await this.databaseService.queryStartTrasaction()

        try {

            let res = await this.databaseService.queryInsert(queryRunner,
                TableName.Table_Users, keysUser.join(','), valueUser.join(','))

            keysPassword = ['id_users', ...keysPassword]
            valuePassword = [res.insertId, ...valuePassword]
            valuePassword = valuePassword.map(i => "'" + i + "'");

            await this.databaseService.queryInsert(queryRunner, TableName.Table_Passport,
                keysPassword.join(','), valuePassword.join(','))

            await this.databaseService.queryInsert(queryRunner, TableName.Table_Devices_Info,
                keysDevice.join(','), valueDevice.join(','))

            await this.databaseService.queryCommitTransaction(queryRunner)

            let queryString = {}
            queryString['id_users'] = res.insertId
            let userInfo = await this.databaseService.querySelectSingleRow(TableName.Table_Users,
                queryString)
            return formatResponse(200,
                'Sucessfully regsitered user!!',
                userInfo)


        } catch (err) {
            // if we have errors, rollback changes we made
            await this.databaseService.queryRollBackTransaction(queryRunner)

        } finally {
            // release query runner which is manually created:
            await this.databaseService.queryReleaseQueryRunner(queryRunner)
        }

        return formatResponse(201,
            'Please try again!!',
            null)

    }
    async getAllUsers() {

        let res = await this.databaseService.querySelectAll(TableName.Table_Users)

        return formatResponse(200,
            'Sucessfully fetched users',
            res)
    }

    async getUserInfo(userId: Number) {

        var queryString = {}
        queryString['id_users'] = userId

        let res = await this.databaseService.querySelectSingleRow(TableName.Table_Users, queryString)
        return formatResponse(200,
            'Sucessfully fetched users',
            res)

    }
}

