import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNumber, IsString, MaxLength, MinLength, } from 'class-validator';

export class CreateUsersDto {
    id_users: BigInt;

    @IsString()
    @IsEmail()
    @ApiProperty({ example: 'test@test.com', description: 'Email address to be registered' })
    email: string;

    @IsString()
    @MinLength(2, {
        message: 'User name is too short. Minimal length is $constraint1 characters.'
    })
    @MaxLength(30, { message: 'User name is too long. Maximal length is $constraint1 characters.' })
    @ApiProperty({ example: 'test', description: 'Name of user' })
    user_name: string;

    date_of_birth: string = ""

    @MinLength(6, {
        message: 'Password is too short. Minimal length is $constraint1 characters.'
    })
    @ApiProperty({ example: '12345678', description: 'Password required to be use later while login in app' })
    password: string

    @IsString()
    @ApiProperty({ example: 'APP_USER', description: 'Role of user' })
    role: string = 'APP_USER';

    @ApiProperty({ example: 'APP', description: 'Login type of user. In case of social media -> use that type' })
    login_type: string = "APP";

    @IsString()
    @ApiProperty({ example: 'hfdjsfhjdsfwqewqr', description: 'Device UDID from which register request is generated' })
    device_uniqueid: string = "";

    @IsString()
    @ApiProperty({ example: '12.0', description: 'Device Os version' })
    device_os_version: string = "";

    @IsString()
    @ApiProperty({ example: 'Android', description: 'Device type android or iOS' })
    device_type: string = "";

    @IsString()
    @ApiProperty({ example: 'Samsung', description: 'Device company name' })
    device_company: string = "";

}