import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { LoginUsersDto } from './dtos/login_users.dto';
import { CreateUsersDto } from './dtos/create_users.dto';

import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppResponseDto } from '../../src/constants/response.dto';
import { Users } from './entities/user.entities';

@ApiBearerAuth('access-token') //edit here
@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Register new user to app' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(@Body() createUserDto: CreateUsersDto): Promise<AppResponseDto<Users>> {
        try {
            let appResponse = this.userService.createUser(createUserDto)
            return appResponse
        }
        catch (err) {
            return new AppResponseDto<Users>(
                400,
                "Server error",
                []
            )
        }
    }

    @Post('/login')
    @HttpCode(200)
    async loginUser(@Body() loginUser: LoginUsersDto): Promise<AppResponseDto<Users>> {
        return this.userService.loginUser(loginUser);

    }

    @Post('/forgotPass')
    @HttpCode(200)
    async forgotPass(@Body() loginUser: LoginUsersDto) {
        console.log("found enauk :" + loginUser.email)

    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserInfo(id);
    }




}
