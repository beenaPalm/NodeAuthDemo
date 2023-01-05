

export enum TableName {
    Table_Users = "users",
    Table_User_Activity_Log = "user_activities_log",
    Table_Passport = "passport",
    Table_Otp_Verification = "otp_verification",
    Table_Devices_Info = "devices_info",
    Table_User_Session = "user_session"
}



export enum ResponseKey {
    Res_Status = "statusCode",
    Res_Message = "message",
    Res_Data = "data"
}


export function formatResponse(statusCode: Number, message: string, data: Object) {
    let response = {}
    response[ResponseKey.Res_Status] = statusCode
    response[ResponseKey.Res_Message] = message
    response[ResponseKey.Res_Data] = data
    return response
}
