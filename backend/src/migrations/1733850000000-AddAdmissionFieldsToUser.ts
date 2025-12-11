import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmissionFieldsToUser1733850000000 implements MigrationInterface {
    name = 'AddAdmissionFieldsToUser1733850000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "jambRegNo" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "waecRegNo" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "waecExamDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "waecExamDate"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "waecRegNo"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "jambRegNo"`);
    }

}
