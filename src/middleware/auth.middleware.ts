import { Injectable, NestMiddleware } from '@nestjs/common';
import { StatusCode, TableName } from '../../src/constants/app.constants';
import { AppMessages } from '../../src/constants/app.messages';
import { AppResponseDto } from '../../src/constants/response.dto';
import * as jwt from 'jsonwebtoken'
import { DatabaseService } from '../../src/database/database.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private databaseService: DatabaseService) {

  }

  async use(req: any, res: any, next: () => void) {

    console.log(req.headers.authorization)
    if (req.headers && req.headers.authorization) {
      const authHeader = req.headers.authorization.split(' ');
      if (authHeader && authHeader.length == 2) {
        let token = authHeader[1]

        try {
          // verify a token symmetric
          let responseVerification = await jwt.verify(token, `${process.env.JWT_SECRET}`);

          if (responseVerification) {
            let queryRunner = await this.databaseService.queryGetQueryRunner()

            const result = await queryRunner.query("SELECT access_token FROM " + TableName.Table_User_Session +
              " WHERE id_users = " + responseVerification.userId + " AND id_devices=" + responseVerification.deviceId);
            console.log(result)
            await this.databaseService.queryReleaseQueryRunner(queryRunner)

            if (result && result.length > 0) {
              if (result[0].access_token == token) {
                next();
              }
              else {
                res.send(new AppResponseDto(StatusCode.Status_Token_inValid,
                  AppMessages.Msg_Err_InValid_Token,
                  []))
              }
            }
            else {
              res.send(new AppResponseDto(StatusCode.Status_Show_Error,
                AppMessages.Msg_Err_User_Not_Valid,
                []))
            }
          }
          else {
            res.send(new AppResponseDto(StatusCode.Status_Show_Error,
              AppMessages.Msg_Err_No_Access,
              []))
          }
        }
        catch (err) {

          res.send(new AppResponseDto(StatusCode.Status_UnAuthorized,
            err.message,
            []))
        }
      }
      else {
        res.send(new AppResponseDto(StatusCode.Status_Show_Error,
          AppMessages.Msg_Err_No_Access,
          []))
      }
    }
    else {
      res.send(new AppResponseDto(StatusCode.Status_Show_Error,
        AppMessages.Msg_Err_No_Access,
        []))
    }

  }
}
