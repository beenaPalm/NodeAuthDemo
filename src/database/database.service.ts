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


    async executeQuery(queryStr: string, queryParams?: any[]) {
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
    async findOne(queryStr: string, queryParams?: any[]) {
        console.log("----------------")
        console.log(queryStr)
        console.log(queryParams)
        console.log("----------------")


        let queryRunner = undefined;
        try {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            const result = await queryRunner.query(queryStr, queryParams);
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

