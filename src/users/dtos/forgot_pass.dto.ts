import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPassDto {

    @IsString()
    @IsEmail()
    @ApiProperty({ example: 'test@test.com', description: 'User login email address' })
    email: string;

}