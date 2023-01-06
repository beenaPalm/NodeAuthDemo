
import * as bcrypt from 'bcrypt';

export enum AppMessages {
    ///******************** User ******************/

    Msg_Err_Login = "Password is not correct!!",
    Msg_Err_Login_User_Not_Registered = "User is not registered with provided email address!!",
    Msg_Err_Reg_Email_Already_Registerd = "Please try with other email address. This is already registered!!",
    Msg_Err_Try_Again = "Please try again!!",


    Msg_Succ_Regsiter = "Successfully registered user.",
    Msg_Succ_Login = "Successfully logged in user.",
    Msg_Succ_Users = "Successfullt fetched users",

}
