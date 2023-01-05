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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DatabaseService = class DatabaseService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async querySelectAll(tableName) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const result = await queryRunner.query("SELECT * FROM " + tableName);
        return result;
    }
    async querySelectSingleRow(tableName, queryObject) {
        let entries = Object.entries(queryObject);
        let queryString = entries.map(([key, val]) => {
            return `${key} = '${val}' `;
        });
        let whereClause = queryString.join(' AND ');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const result = await queryRunner.query("SELECT * FROM " + tableName + " WHERE " + whereClause);
        return result;
    }
    async queryInsert(queryRunner, tableName, keys, values) {
        let queryStr = "INSERT INTO " + tableName + "(" + keys + ") values (" + values + ")";
        try {
            const result = await queryRunner.query(queryStr);
            return result;
        }
        catch (err) {
            return null;
        }
    }
    async queryStartTrasaction() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }
    async queryCommitTransaction(queryRunner) {
        await queryRunner.commitTransaction();
    }
    async queryRollBackTransaction(queryRunner) {
        await queryRunner.rollbackTransaction();
    }
    async queryGetQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
    }
    async queryReleaseQueryRunner(queryRunner) {
        await queryRunner.release();
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map