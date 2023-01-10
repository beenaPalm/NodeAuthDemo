import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {

    async login(payload: Object) {

        return jwt.sign(payload, `${process.env.JWT_SECRET}`,
            { expiresIn: '2d' }
        )

    }
}
