"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUsersDto {
    constructor() {
        this.date_of_birth = "";
        this.role = 'APP_USER';
        this.login_type = "APP";
        this.user_status = 1;
        this.device_uniqueid = "";
        this.device_os_version = "";
        this.device_type = "";
        this.device_company = "";
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, {
        message: 'User name is too short. Minimal length is $constraint1 characters.'
    }),
    (0, class_validator_1.MaxLength)(30, { message: 'User name is too long. Maximal length is $constraint1 characters.' }),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "user_name", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6, {
        message: 'Password is too short. Minimal length is $constraint1 characters.'
    }),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "login_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUsersDto.prototype, "user_status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "device_uniqueid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "device_os_version", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "device_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUsersDto.prototype, "device_company", void 0);
exports.CreateUsersDto = CreateUsersDto;
//# sourceMappingURL=create_users.dto.js.map