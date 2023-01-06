import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from '../../src/middleware/auth.middleware';
import { DatabaseService } from '../../src/database/database.service';
import { UsersController } from './users.controller';
import { UsersQueries } from './users.queries';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersQueries, DatabaseService],
})
export class UsersModule {

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: 'users/*', method: RequestMethod.GET });
    }
}
