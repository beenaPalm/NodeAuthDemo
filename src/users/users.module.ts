import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersController } from './users.controller';
import { UsersQueries } from './users.queries';
import { UsersService } from './users.service';


@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersQueries, DatabaseService]
})
export class UsersModule {


}
