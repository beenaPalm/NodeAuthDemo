import { ApiProperty } from '@nestjs/swagger';

export class Users {
    @ApiProperty({ example: '1', description: 'Looged in user id' })
    id_users: number;


    @ApiProperty({ example: 'test@test.com', description: 'Email address to be registered' })
    email: string;


    @ApiProperty({ example: 'test', description: 'Name of user' })
    user_name: string;

    @ApiProperty({ example: '07-04-1992', description: 'Birthdate of user' })
    date_of_birth: string = ""

    @ApiProperty({ example: 'APP_USER', description: 'Role of user' })
    role: string = 'APP_USER';

}
