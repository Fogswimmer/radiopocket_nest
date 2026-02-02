import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1770027359597 implements MigrationInterface {
  name = 'Migration1770027359597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "email" character varying(100), "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "lastLogin" TIMESTAMP, "avatar" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
