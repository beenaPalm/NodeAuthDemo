"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = exports.ResponseKey = exports.TableName = void 0;
var TableName;
(function (TableName) {
    TableName["Table_Users"] = "users";
    TableName["Table_User_Activity_Log"] = "user_activities_log";
    TableName["Table_Passport"] = "passport";
    TableName["Table_Otp_Verification"] = "otp_verification";
    TableName["Table_Devices_Info"] = "devices_info";
    TableName["Table_User_Session"] = "user_session";
})(TableName = exports.TableName || (exports.TableName = {}));
var ResponseKey;
(function (ResponseKey) {
    ResponseKey["Res_Status"] = "statusCode";
    ResponseKey["Res_Message"] = "message";
    ResponseKey["Res_Data"] = "data";
})(ResponseKey = exports.ResponseKey || (exports.ResponseKey = {}));
function formatResponse(statusCode, message, data) {
    let response = {};
    response[ResponseKey.Res_Status] = statusCode;
    response[ResponseKey.Res_Message] = message;
    response[ResponseKey.Res_Data] = data;
    return response;
}
exports.formatResponse = formatResponse;
//# sourceMappingURL=app.constants.js.map