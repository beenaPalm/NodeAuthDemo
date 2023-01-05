import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database/database.service';
import { ConfigModule } from '@nestjs/config';

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
  ],
  providers: [DatabaseService]

})
export class AppModule implements NestModule {


  configure(consumer: MiddlewareConsumer) {

    consumer.
      apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET })

  }

}
