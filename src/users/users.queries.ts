import { Injectable } from '@nestjs/common';
import { TableName } from '../../src/constants/app.constants';



@Injectable()
export class UsersQueries {


    findAll(): string {
        return `SELECT * FROM  ${TableName.Table_Users}`
    }

    findOne(id: number): string {
        return `SELECT * FROM ${TableName.Table_Users} where id_users = ${id}`
    }

    findOneByEmail(email: string): string {
        return `SELECT * FROM ${TableName.Table_Users} where email = ${email}`
    }


    findUserLoggedIn() {


        return `SELECT u.*,p.password FROM ${TableName.Table_Users} u  LEFT JOIN  ${TableName.Table_Passport} p ON p.id_users = u.id_users AND p.login_type =? 
         WHERE u.email=? AND u.user_status=1`;

    };


    checkUserEmail() {

        return `SELECT COUNT(id_users) as email_count FROM ${TableName.Table_Users} WHERE email=?`;
    };

    checkUserDevice() {

        return `SELECT id_devices FROM  ${TableName.Table_Devices_Info}  
        WHERE device_uniqueid=? AND device_type=? AND device_os_version=? AND device_company=?`
    };

    insertData(tableName: string) {

        return `INSERT INTO ${tableName} (?) values (?)`;

    }


    insertUpdateSessionInfo() {
        return "INSERT INTO " + TableName.Table_User_Session + " (?) VALUES (?)  ON DUPLICATE KEY UPDATE serial_no=?, refresh_token=? , access_token=?"
    }

    insertUpdatePassword() {
        return "INSERT INTO " + TableName.Table_Passport + "(?) values (?) ON DUPLICATE KEY UPDATE password =?";
    };

    insertUpdateAddVerificationCode() {

        return "INSERT INTO " + TableName.Table_Otp_Verification +
            " (?) VALUES (?) ON DUPLICATE KEY UPDATE  verification_code=?, expired_time=? , total_verification=total_verification+1"
    };

}

