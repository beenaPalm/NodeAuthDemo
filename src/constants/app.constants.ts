
import * as bcrypt from 'bcrypt';

export enum TableName {
    Table_Users = "users",
    Table_User_Activity_Log = "user_activities_log",
    Table_Passport = "passport",
    Table_Otp_Verification = "otp_verification",
    Table_Devices_Info = "devices_info",
    Table_User_Session = "user_session"
}


export enum StatusCode {
    Status_Success = 200,
    Status_Show_Error = 201,
}



export async function getSecurePassword(password: string) {

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash
}


// compare password
export async function comparePassword(plaintextPassword, passwordHash) {
    const result = await bcrypt.compare(plaintextPassword, passwordHash);
    return result;
}