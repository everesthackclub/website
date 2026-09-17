/*
  Warnings:

  - A unique constraint covering the columns `[email,eventId]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create Event table first
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create a default event for existing data
INSERT INTO "Event" ("id", "name", "description", "date", "time", "location", "isActive", "createdAt", "updatedAt")
VALUES (
    'default-event-001',
    'Weekly Hack Session',
    'Our first hack session of the season',
    '2026-09-04 09:00:00',
    '9:00 AM - 11:00 AM',
    'Everest College, Biratnagar',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Step 3: Drop old unique constraint on email
DROP INDEX "Attendee_email_key";

-- Step 4: Add eventId column with default value pointing to the default event
ALTER TABLE "Attendee" ADD COLUMN "eventId" TEXT NOT NULL DEFAULT 'default-event-001';

-- Step 5: Remove default after data is populated
ALTER TABLE "Attendee" ALTER COLUMN "eventId" DROP DEFAULT;

-- Step 6: Add role to Organizer
ALTER TABLE "Organizer" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'organizer';

-- Step 7: Create indexes
CREATE INDEX "Attendee_eventId_idx" ON "Attendee"("eventId");
CREATE INDEX "Attendee_isCheckedIn_idx" ON "Attendee"("isCheckedIn");

-- Step 8: Create unique constraint on email + eventId
CREATE UNIQUE INDEX "Attendee_email_eventId_key" ON "Attendee"("email", "eventId");

-- Step 9: Add foreign key
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
