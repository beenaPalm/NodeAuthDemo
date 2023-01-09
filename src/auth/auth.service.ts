import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) { }

    async login(payload: Object) {

        return this.jwtService.sign(payload)

    }
}
