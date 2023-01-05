import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req, Res, UseFilters } from '@nestjs/common';
import { CreateUsersDto } from './dtos/create_users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }



    @Post()
    @HttpCode(200)
    create(@Body() createUserDto: CreateUsersDto) {
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



}
