import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';


@Module({
    // imports: [
    //     JwtModule.register({
    //         secret: jwtConstants.secret,
    //         signOptions: { expiresIn: '60s' },
    //     }),
    //     UsersModule
    // ],
    providers: [AuthService],
    exports: [AuthService],

})

export class AuthModule { }
