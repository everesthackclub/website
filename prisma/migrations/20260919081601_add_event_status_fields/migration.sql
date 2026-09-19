-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFormOpen" BOOLEAN NOT NULL DEFAULT true;
