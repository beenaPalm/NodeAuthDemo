export declare enum TableName {
    Table_Users = "users",
    Table_User_Activity_Log = "user_activities_log",
    Table_Passport = "passport",
    Table_Otp_Verification = "otp_verification",
    Table_Devices_Info = "devices_info",
    Table_User_Session = "user_session"
}
export declare enum StatusCode {
    Status_Success = 200,
    Status_Show_Error = 201
}
export declare function getSecurePassword(password: string): Promise<string>;
