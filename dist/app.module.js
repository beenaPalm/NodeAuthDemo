"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const logger_middleware_1 = require("./logger/logger.middleware");
const typeorm_1 = require("@nestjs/typeorm");
const database_service_1 = require("./database/database.service");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.
            apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes({ path: 'users', method: common_1.RequestMethod.GET });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `${process.env.NODE_ENV}.env`
            }),
            users_module_1.UsersModule,
            typeorm_1.TypeOrmModule.forRoot({
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
        providers: [database_service_1.DatabaseService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map