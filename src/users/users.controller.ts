import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req, Res, UseFilters } from '@nestjs/common';
import { LoginUsersDto } from './dtos/login_users.dto';
import { CreateUsersDto } from './dtos/create_users.dto';

import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppResponseDto } from '../../src/constants/response.dto';
import { AppMessages } from 'src/constants/app.messages';
import { StatusCode } from '../../src/constants/app.constants';
import { Users } from './entities/user.entities';


@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }


    // : Promise<AppResponseDto<Users>>
    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Register new user to app' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async create(@Body() createUserDto: CreateUsersDto): Promise<AppResponseDto<Users>> {
        return this.userService.createUser(createUserDto)
    }

    @Get('')
    @HttpCode(200)
    async findAll() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserInfo(id);
    }

    @Post('/login')
    @HttpCode(200)
    async loginUser(@Body() loginUser: LoginUsersDto) {
        return this.userService.loginUser(loginUser);

    }


}
