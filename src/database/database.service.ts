import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';



@Injectable()
export class DatabaseService {

    constructor(private dataSource: DataSource) {

    }

    async queryStartTrasaction() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        return queryRunner
    }

    async queryCommitTransaction(queryRunner: QueryRunner) {
        await queryRunner.commitTransaction()
        await queryRunner.release()
    }

    async queryRollBackTransaction(queryRunner: QueryRunner) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
    }

    async queryGetQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        return queryRunner
    }

    async queryReleaseQueryRunner(queryRunner: QueryRunner) {
        await queryRunner.release()
    }

    async queryInsert(queryRunner: QueryRunner, tableName: string, keys: string, values: string) {
        let queryStr = "INSERT INTO " + tableName + "(" + keys + ") values (" + values + ")";
        const result = await queryRunner.query(queryStr);
        return result

    }



}

