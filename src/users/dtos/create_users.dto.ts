import { IsDate, IsEmail, IsNumber, IsString, MaxLength, MinLength, } from 'class-validator';

export class CreateUsersDto {
    id_users: BigInt;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2, {
        message: 'User name is too short. Minimal length is $constraint1 characters.'
    })
    @MaxLength(30, { message: 'User name is too long. Maximal length is $constraint1 characters.' })
    user_name: string;

    date_of_birth: string = ""

    @MinLength(6, {
        message: 'Password is too short. Minimal length is $constraint1 characters.'
    })
    password: string

    @IsString()
    role: string = 'APP_USER';

    @IsString()
    login_type: string = "APP";

    @IsNumber()
    user_status: Number = 1;

    @IsString()
    device_uniqueid: string = "";

    @IsString()
    device_os_version: string = "";

    @IsString()
    device_type: string = "";

    @IsString()
    device_company: string = "";

}