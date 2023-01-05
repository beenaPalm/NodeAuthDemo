export declare enum TableName {
    Table_Users = "users",
    Table_User_Activity_Log = "user_activities_log",
    Table_Passport = "passport",
    Table_Otp_Verification = "otp_verification",
    Table_Devices_Info = "devices_info",
    Table_User_Session = "user_session"
}
export declare enum ResponseKey {
    Res_Status = "statusCode",
    Res_Message = "message",
    Res_Data = "data"
}
export declare function formatResponse(statusCode: Number, message: string, data: Object): {};
