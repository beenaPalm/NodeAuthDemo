"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurePassword = exports.StatusCode = exports.TableName = void 0;
const bcrypt = require("bcrypt");
var TableName;
(function (TableName) {
    TableName["Table_Users"] = "users";
    TableName["Table_User_Activity_Log"] = "user_activities_log";
    TableName["Table_Passport"] = "passport";
    TableName["Table_Otp_Verification"] = "otp_verification";
    TableName["Table_Devices_Info"] = "devices_info";
    TableName["Table_User_Session"] = "user_session";
})(TableName = exports.TableName || (exports.TableName = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Status_Success"] = 200] = "Status_Success";
    StatusCode[StatusCode["Status_Show_Error"] = 201] = "Status_Show_Error";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
async function getSecurePassword(password) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
}
exports.getSecurePassword = getSecurePassword;
//# sourceMappingURL=app.constants.js.map