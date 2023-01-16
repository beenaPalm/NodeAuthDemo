import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { LoginUsersDto } from './dtos/login_users.dto';
import { CreateUsersDto } from './dtos/create_users.dto';

import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppResponseDto } from '../../src/constants/response.dto';
import { Users } from './entities/user.entities';
import { ForgotPassDto } from './dtos/forgot_pass.dto';

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

            let user = await this.userService.createUser(createUserDto)
            return new AppResponseDto<Users>(
                200,
                "Server error",
                user
            )
            // PARTH :: 
            // Service should resturn only user --
            // Response mappding should be adjust here
            // Post Api should return only Single object right ??
            // so Naming should be User not Users (database name we can keep users)
            // user.entities.ts -> user.entity.ts
        }
        catch (err) {
            return null
            // return new AppResponseDto<Users>(
            //     400,
            //     "Server error",
            //     null
            // )
        }
    }

    @Post('/login')
    @HttpCode(200)
    async loginUser(@Body() loginUser: LoginUsersDto): Promise<AppResponseDto<Users>> {
        try {

            let user = await this.userService.loginUser(loginUser)
            return new AppResponseDto<Users>(
                200,
                "Server error",
                user
            )
        }
        catch (err) {
            return null
            // return new AppResponseDto<Users>(
            //     400,
            //     "Server error",
            //     null
            // )
        }

    }

    @Post('/forgotPass')
    @HttpCode(200)
    async forgotPass(@Body() forgotPass: ForgotPassDto) {
        try {
            let user = await this.userService.forgotPassword(forgotPass)
            return new AppResponseDto<Users>(
                200,
                "Server error",
                user
            )
        }
        catch (err) {
            return null
            // return new AppResponseDto<Users>(
            //     400,
            //     "Server error",
            //     null
            // )
        }
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            let user = await this.userService.getUserInfo(id)
            return new AppResponseDto<Users>(
                200,
                "Server error",
                user
            )
        }
        catch (err) {
            return new AppResponseDto<Users>(
                400,
                "Server error",
                null
            )
        }
    }




}
