import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}

// @Catch(QueryFailedError)
// export class QueryFailedErrorFilter implements ExceptionFilter {
//     catch(exception: QueryFailedError, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();
//         const request = ctx.getRequest<Request>();
//         const status = 502

//         response
//             .status(status)
//             .json({
//                 statusCode: status,
//                 timestamp: new Date().toISOString(),
//                 path: request.url,
//             });
//     }
// }
