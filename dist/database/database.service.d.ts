import { DataSource, QueryRunner } from 'typeorm';
export declare class DatabaseService {
    private dataSource;
    constructor(dataSource: DataSource);
    queryStartTrasaction(): Promise<QueryRunner>;
    queryCommitTransaction(queryRunner: QueryRunner): Promise<void>;
    queryRollBackTransaction(queryRunner: QueryRunner): Promise<void>;
    queryGetQueryRunner(): Promise<QueryRunner>;
    queryReleaseQueryRunner(queryRunner: QueryRunner): Promise<void>;
    queryInsert(queryRunner: QueryRunner, tableName: string, keys: string, values: string): Promise<any>;
}
