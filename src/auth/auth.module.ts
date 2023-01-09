import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from '../auth/auth.constants';
import { UsersModule } from '../../src/users/users.module';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
        UsersModule
    ],
    providers: [AuthService],
    exports: [AuthService],

})

export class AuthModule { }
