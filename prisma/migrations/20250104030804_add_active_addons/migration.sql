-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activeAddons" TEXT[] DEFAULT ARRAY[]::TEXT[];
