import { Injectable } from '@nestjs/common';
import { type } from 'os';
import { DataSource, QueryRunner } from 'typeorm';


export class TransctionBlock {
    myCallback: { (msg: string): QueryRunner; };
}
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

    async executeQuery(queryStr: string, []) {
        let queryRunner = undefined;
        try {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            const result = await queryRunner.query(queryStr);
            await queryRunner.release()
            return result
        } catch (error) {
            try {
                await queryRunner.release()
            } catch (error) {
                //Ignore Worst Case let variable will release with GC
            }
        }
    }
    async findAll(queryStr: string, queryParams?: []) {
        let queryRunner = undefined;
        try {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            const result = await queryRunner.query(queryStr, queryParams);
            await queryRunner.release()
            return result
        } catch (error) {
            try {
                await queryRunner.release()
            } catch (error) {
                //Ignore Worst Case let variable will release with GC
            }
        }
    }
    async findOne(queryStr: string, []) {
        let queryRunner = undefined;
        try {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            const result = await queryRunner.query(queryStr);
            await queryRunner.release()
            return result ? result[0] : null
        } catch (error) {
            try {
                await queryRunner.release()
            } catch (error) {
                //Ignore Worst Case let variable will release with GC
            }
        }
    }

    async executeQueryInTransaction(params: any, callback: any) {
        let queryRunner = undefined;
        try {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            await queryRunner.startTransaction()
            params.myCallback(queryRunner)
        } catch (error) {
            try {
                await queryRunner.release()
            } catch (error) {
                //Ignore Worst Case let variable will release with GC
            }
        }
    }

}

