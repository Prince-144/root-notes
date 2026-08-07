import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  ALTER TABLE "articles" ADD COLUMN "status" "enum_articles_status" DEFAULT 'draft' NOT NULL;
  ALTER TABLE "articles" ADD COLUMN "cover_image_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "status";
  ALTER TABLE "articles" DROP COLUMN "cover_image_url";
  DROP TYPE "public"."enum_articles_status";`)
}
