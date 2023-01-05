import { Injectable } from '@nestjs/common';
import { TableName } from 'src/constants/app.constants';
import { DataSource, QueryRunner } from 'typeorm';



@Injectable()
export class DatabaseService {

    constructor(private dataSource: DataSource) {

    }



    async querySelectAll(tableName: string) {

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()

        const result = await queryRunner.query("SELECT * FROM " + tableName);
        return result


    }


    async querySelectSingleRow(tableName: string, queryObject: Object) {

        let entries = Object.entries(queryObject)
        let queryString = entries.map(([key, val]) => {
            return `${key} = '${val}' `;
        });
        let whereClause = queryString.join(' AND ')
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        const result = await queryRunner.query("SELECT * FROM " + tableName + " WHERE " + whereClause);
        return result
    }

    async queryInsert(queryRunner: QueryRunner, tableName: string, keys: string, values: string) {
        let queryStr = "INSERT INTO " + tableName + "(" + keys + ") values (" + values + ")";
        try {
            const result = await queryRunner.query(queryStr);
            return result
        }
        catch (err) {
            return null
        }
    }

    async queryStartTrasaction() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        return queryRunner
    }

    async queryCommitTransaction(queryRunner: QueryRunner) {
        await queryRunner.commitTransaction()
    }

    async queryRollBackTransaction(queryRunner: QueryRunner) {
        await queryRunner.rollbackTransaction()
    }

    async queryGetQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
    }

    async queryReleaseQueryRunner(queryRunner: QueryRunner) {
        await queryRunner.release()
    }

}

