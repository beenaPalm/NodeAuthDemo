import { DataSource, QueryRunner } from 'typeorm';
export declare class DatabaseService {
    private dataSource;
    constructor(dataSource: DataSource);
    querySelectAll(tableName: string): Promise<any>;
    querySelectSingleRow(tableName: string, queryObject: Object): Promise<any>;
    queryInsert(queryRunner: QueryRunner, tableName: string, keys: string, values: string): Promise<any>;
    queryStartTrasaction(): Promise<QueryRunner>;
    queryCommitTransaction(queryRunner: QueryRunner): Promise<void>;
    queryRollBackTransaction(queryRunner: QueryRunner): Promise<void>;
    queryGetQueryRunner(): Promise<void>;
    queryReleaseQueryRunner(queryRunner: QueryRunner): Promise<void>;
}
