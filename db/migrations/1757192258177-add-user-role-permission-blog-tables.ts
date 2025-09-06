import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRolePermissionBlogTables1757192258177
  implements MigrationInterface
{
  name = 'AddUserRolePermissionBlogTables1757192258177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."blogs_status_enum" AS ENUM('draft', 'published', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs"
       (
         "id"        uuid                         NOT NULL DEFAULT uuid_generate_v4(),
         "title"     character varying            NOT NULL,
         "content"   text                         NOT NULL,
         "excerpt"   character varying,
         "status"    "public"."blogs_status_enum" NOT NULL DEFAULT 'draft',
         "featured"  boolean                      NOT NULL DEFAULT false,
         "tags"      text,
         "createdAt" TIMESTAMP                    NOT NULL DEFAULT now(),
         "updatedAt" TIMESTAMP                    NOT NULL DEFAULT now(),
         CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "users"
       (
         "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
         "email"     character varying NOT NULL,
         "firstName" character varying NOT NULL,
         "lastName"  character varying NOT NULL,
         "password"  character varying NOT NULL,
         "isActive"  boolean           NOT NULL DEFAULT true,
         "avatar"    character varying,
         "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
         "updatedAt" TIMESTAMP         NOT NULL DEFAULT now(),
         CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
         CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_action_enum" AS ENUM('manage', 'create', 'read', 'update', 'delete')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_subject_enum" AS ENUM('all', 'User', 'Role', 'Permission', 'Blog')`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions"
       (
         "id"          uuid                                NOT NULL DEFAULT uuid_generate_v4(),
         "action"      "public"."permissions_action_enum"  NOT NULL,
         "subject"     "public"."permissions_subject_enum" NOT NULL,
         "conditions"  character varying,
         "fields"      character varying,
         "description" character varying                   NOT NULL,
         "createdAt"   TIMESTAMP                           NOT NULL DEFAULT now(),
         "updatedAt"   TIMESTAMP                           NOT NULL DEFAULT now(),
         CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
       );
      COMMENT
      ON COLUMN "permissions"."action" IS 'The action that can be performed (create, read, update, delete, manage)'; COMMENT
      ON COLUMN "permissions"."subject" IS 'The subject/resource the action can be performed on'`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles"
       (
         "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
         "name"        character varying NOT NULL,
         "description" character varying NOT NULL,
         "isActive"    boolean           NOT NULL,
         "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
         "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
         CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles"
       (
         "user_id" uuid NOT NULL,
         "role_id" uuid NOT NULL,
         CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id")
       )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions"
       (
         "permission_id" uuid NOT NULL,
         "role_id"       uuid NOT NULL,
         CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("permission_id", "role_id")
       )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles"
        ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles"
        ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions"
        ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions"
        ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_subject_enum"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_action_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TYPE "public"."blogs_status_enum"`);
  }
}
