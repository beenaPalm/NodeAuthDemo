import { IsDate, IsEmail, IsNumber, IsString, MaxLength, MinLength, } from 'class-validator';

export class LoginUsersDto {

    @IsString()
    @IsEmail()
    email: string;

    @MinLength(6, {
        message: 'Password is too short. Minimal length is $constraint1 characters.'
    })
    password: string

    @IsString()
    login_type: string = "APP";

    @IsString()
    device_uniqueid: string = "";

    @IsString()
    device_os_version: string = "";

    @IsString()
    device_type: string = "";

    @IsString()
    device_company: string = "";


}