import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770206890595 implements MigrationInterface {
    name = 'Migration1770206890595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "station" ("id" SERIAL NOT NULL, "slug" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "streamUrl" character varying NOT NULL, "website" character varying, "description" character varying, "genre" character varying(255), "location" character varying(255), "logo" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "listenersCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_cad1b3e7182ef8df1057b82f6aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "station_users_user" ("stationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_1d02aca87c402e4ffa35c6fbad5" PRIMARY KEY ("stationId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69ea38cf39f6a4c1c89cc0bbbc" ON "station_users_user" ("stationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1ba0515b31b5c13a8be351952e" ON "station_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user_favorite_stations_station" ("userId" integer NOT NULL, "stationId" integer NOT NULL, CONSTRAINT "PK_8d9740ff337611cb83896eddd12" PRIMARY KEY ("userId", "stationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_883c2865d7670cbd942c873472" ON "user_favorite_stations_station" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f9de552af205de815fea972e8" ON "user_favorite_stations_station" ("stationId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin', 'moderator')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "station_users_user" ADD CONSTRAINT "FK_69ea38cf39f6a4c1c89cc0bbbc5" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "station_users_user" ADD CONSTRAINT "FK_1ba0515b31b5c13a8be351952e7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorite_stations_station" ADD CONSTRAINT "FK_883c2865d7670cbd942c873472d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorite_stations_station" ADD CONSTRAINT "FK_1f9de552af205de815fea972e81" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorite_stations_station" DROP CONSTRAINT "FK_1f9de552af205de815fea972e81"`);
        await queryRunner.query(`ALTER TABLE "user_favorite_stations_station" DROP CONSTRAINT "FK_883c2865d7670cbd942c873472d"`);
        await queryRunner.query(`ALTER TABLE "station_users_user" DROP CONSTRAINT "FK_1ba0515b31b5c13a8be351952e7"`);
        await queryRunner.query(`ALTER TABLE "station_users_user" DROP CONSTRAINT "FK_69ea38cf39f6a4c1c89cc0bbbc5"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive', 'banned')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f9de552af205de815fea972e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_883c2865d7670cbd942c873472"`);
        await queryRunner.query(`DROP TABLE "user_favorite_stations_station"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ba0515b31b5c13a8be351952e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69ea38cf39f6a4c1c89cc0bbbc"`);
        await queryRunner.query(`DROP TABLE "station_users_user"`);
        await queryRunner.query(`DROP TABLE "station"`);
    }

}
