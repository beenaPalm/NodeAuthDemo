import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPassDto } from 'src/users/dtos/forgot_pass.dto';
import { Users } from 'src/users/entities/user.entities';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) { }

    async sendUserVerificationCode(user: Users, verificationCode: String) {
        try {


            let res = await this.mailerService.sendMail({
                to: user.email,
                // from: '"Support Team" <support@example.com>', // override default from
                subject: 'Welcome to Session App! Verification Code!!',
                template: './confirmation', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    name: user.user_name,
                    code: verificationCode
                },
            });

            if (res) {
                return true
            }
            else {
                return false
            }

        }
        catch (errors) {
            console.log(errors)
            return false

        }
    }
}
