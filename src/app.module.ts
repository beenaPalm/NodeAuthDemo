import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';
import { MailModule } from './mail/mail.module';
import { AuthQueries } from './auth/auth.queries';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: `mysql`,
      host: `${process.env.DATABASE_HOST}`,
      port: Number(`${process.env.DATABASE_PORT}`),
      username: `${process.env.DATABASE_USER}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      entities: [],
      synchronize: true,
    }),
    MailModule,
    AuthModule],
  providers: [AuthService, DatabaseService, AuthQueries],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    consumer.
      apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET })

    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }

}
