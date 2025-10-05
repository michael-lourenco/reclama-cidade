-- CreateEnum
CREATE TYPE "ProblemStatus" AS ENUM ('REPORTED', 'UNDER_ANALYSIS', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED');

-- CreateTable
CREATE TABLE "Marker" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,
    "currentStatus" "ProblemStatus" NOT NULL DEFAULT 'REPORTED',
    "likedBy" TEXT[],
    "resolvedBy" TEXT[],

    CONSTRAINT "Marker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusChange" (
    "id" TEXT NOT NULL,
    "markerId" TEXT NOT NULL,
    "status" "ProblemStatus" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "StatusChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marker" ADD CONSTRAINT "Marker_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusChange" ADD CONSTRAINT "StatusChange_markerId_fkey" FOREIGN KEY ("markerId") REFERENCES "Marker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
