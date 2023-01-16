import { Injectable } from '@nestjs/common';
import { TableName } from '../constants/app.constants';



@Injectable()
export class AuthQueries {

    findAccessToken() {

        return `SELECT access_token FROM ${TableName.Table_User_Session} WHERE id_users = ? AND id_devices=?`;

    };

}

