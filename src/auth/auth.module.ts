import { Module } from '@nestjs/common';
import { AuthQueries } from './auth.queries';

@Module({
    providers: [AuthQueries],
    exports: [AuthQueries]
})
export class AuthModule {

}
