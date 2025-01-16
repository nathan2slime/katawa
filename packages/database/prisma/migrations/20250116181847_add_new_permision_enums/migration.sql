/*
  Warnings:

  - The values [EDIT_PRODUCT,EDIT_USER] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('CREATE_USER', 'DELETE_USER', 'UPDATE_USER', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'CREATE_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY', 'DELETE_PRODUCT');
ALTER TABLE "Role" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;
