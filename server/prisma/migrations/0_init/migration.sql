-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('entertainment', 'rowing', 'camping', 'wildCooking', 'scouting', 'volunteering', 'other');

-- CreateEnum
CREATE TYPE "AspectCategory" AS ENUM ('scoutingSkills', 'behaviour', 'participation', 'exams', 'other');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('absent', 'execused', 'termExecused', 'attended');

-- CreateEnum
CREATE TYPE "CaptainType" AS ENUM ('general', 'unit', 'regular');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri');

-- CreateEnum
CREATE TYPE "FinanceItemType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('read', 'unread', 'archived');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('attendance', 'report', 'financeItemCreated', 'other');

-- CreateTable
CREATE TABLE "Activity" (
    "activityId" SERIAL NOT NULL,
    "place" VARCHAR(255),
    "weekNumber" INTEGER NOT NULL,
    "termNumber" INTEGER NOT NULL,
    "day" "Days" NOT NULL,
    "type" "ActivityType" NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "ActivityAttendance" (
    "scoutId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "score" INTEGER,
    "attendanceStatus" "AttendanceStatus" NOT NULL,

    CONSTRAINT "ActivityAttendance_pkey" PRIMARY KEY ("scoutId","activityId")
);

-- CreateTable
CREATE TABLE "ActivityGuidance" (
    "activityId" INTEGER NOT NULL,
    "captainId" INTEGER NOT NULL,

    CONSTRAINT "ActivityGuidance_pkey" PRIMARY KEY ("activityId","captainId")
);

-- CreateTable
CREATE TABLE "ActivitySectorParticipation" (
    "activityId" INTEGER NOT NULL,
    "sectorBaseName" VARCHAR NOT NULL,
    "sectorSuffixName" VARCHAR NOT NULL,

    CONSTRAINT "ActivitySectorParticipation_pkey" PRIMARY KEY ("activityId","sectorBaseName","sectorSuffixName")
);

-- CreateTable
CREATE TABLE "Aspect" (
    "aspectId" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sectorBaseName" VARCHAR(255) NOT NULL,
    "sectorSuffixName" VARCHAR(255) NOT NULL,
    "category" "AspectCategory" NOT NULL,

    CONSTRAINT "Aspect_pkey" PRIMARY KEY ("aspectId")
);

-- CreateTable
CREATE TABLE "Captain" (
    "captainId" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "middleName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "rSectorBaseName" VARCHAR(255),
    "rSectorSuffixName" VARCHAR(255),
    "gender" "Gender" NOT NULL,
    "type" "CaptainType" NOT NULL,

    CONSTRAINT "Captain_pkey" PRIMARY KEY ("captainId")
);

-- CreateTable
CREATE TABLE "CaptainAttendance" (
    "captainId" INTEGER NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "termNumber" INTEGER NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL,

    CONSTRAINT "CaptainAttendance_pkey" PRIMARY KEY ("captainId","weekNumber","termNumber")
);

-- CreateTable
CREATE TABLE "FinanceItem" (
    "itemId" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(0) NOT NULL,
    "type" "FinanceItemType" NOT NULL,

    CONSTRAINT "FinanceItem_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(0) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "contentType" "NotificationType" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "OtherItem" (
    "description" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "generalCaptainId" INTEGER,

    CONSTRAINT "OtherItem_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "RecieveNotification" (
    "notificationId" INTEGER NOT NULL,
    "captainId" INTEGER NOT NULL,
    "status" VARCHAR(255),

    CONSTRAINT "RecieveNotification_pkey" PRIMARY KEY ("notificationId","captainId")
);

-- CreateTable
CREATE TABLE "Report" (
    "reportId" SERIAL NOT NULL,
    "info" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "captainId" SERIAL,
    "scoutId" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "Scout" (
    "scoutId" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "middleName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255),
    "expelled" BOOLEAN NOT NULL DEFAULT false,
    "sectorBaseName" VARCHAR(255),
    "sectorSuffixName" VARCHAR(255),
    "gender" "Gender",

    CONSTRAINT "Scout_pkey" PRIMARY KEY ("scoutId")
);

-- CreateTable
CREATE TABLE "ScoutAttendance" (
    "scoutId" INTEGER NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "termNumber" INTEGER NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL,

    CONSTRAINT "ScoutAttendance_pkey" PRIMARY KEY ("scoutId","weekNumber","termNumber")
);

-- CreateTable
CREATE TABLE "ScoutProfile" (
    "birthCertificate" VARCHAR(255),
    "birthDate" DATE,
    "enrollDate" DATE,
    "photo" VARCHAR(255),
    "scoutId" INTEGER NOT NULL,
    "schoolGrade" INTEGER,

    CONSTRAINT "ScoutProfile_pkey" PRIMARY KEY ("scoutId")
);

-- CreateTable
CREATE TABLE "ScoutScore" (
    "scoutId" INTEGER NOT NULL,
    "aspectId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ScoutScore_pkey" PRIMARY KEY ("scoutId","aspectId")
);

-- CreateTable
CREATE TABLE "Sector" (
    "baseName" VARCHAR(255) NOT NULL,
    "suffixName" VARCHAR(255) NOT NULL,
    "unitCaptainId" INTEGER,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("baseName","suffixName")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "documentURL" VARCHAR(255),
    "captainId" INTEGER,
    "weekNumber" INTEGER NOT NULL,
    "termNumber" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "SessionSectorParticipation" (
    "sessionID" INTEGER NOT NULL,
    "sectorBaseName" VARCHAR NOT NULL,
    "sectorSuffixName" VARCHAR NOT NULL,

    CONSTRAINT "SessionSectorParticipation_pkey" PRIMARY KEY ("sessionID","sectorBaseName","sectorSuffixName")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "itemId" SERIAL NOT NULL,
    "sectorBaseName" VARCHAR(255),
    "sectorSuffixName" VARCHAR(255),
    "weekNumber" INTEGER NOT NULL,
    "termNumber" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Term" (
    "termNumber" SERIAL NOT NULL,
    "termName" VARCHAR(255),
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("termNumber")
);

-- CreateTable
CREATE TABLE "Week" (
    "weekNumber" INTEGER NOT NULL,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATE NOT NULL,
    "termNumber" INTEGER NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("weekNumber","termNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "captain_phonenumber_unique" ON "Captain"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "captain_email_unique" ON "Captain"("email");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "activity_weeknumber_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES "Week"("weekNumber", "termNumber") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ActivityAttendance" ADD CONSTRAINT "activityAttendance_activity_FK" FOREIGN KEY ("activityId") REFERENCES "Activity"("activityId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ActivityAttendance" ADD CONSTRAINT "activityAttendance_scout_FK" FOREIGN KEY ("scoutId") REFERENCES "Scout"("scoutId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ActivityGuidance" ADD CONSTRAINT "activityGuidance_activity_FK" FOREIGN KEY ("activityId") REFERENCES "Activity"("activityId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ActivityGuidance" ADD CONSTRAINT "activityGuidance_captain_FK" FOREIGN KEY ("captainId") REFERENCES "Captain"("captainId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ActivitySectorParticipation" ADD CONSTRAINT "activityParticipation_activity_FK" FOREIGN KEY ("activityId") REFERENCES "Activity"("activityId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ActivitySectorParticipation" ADD CONSTRAINT "activityParticipation_sector_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES "Sector"("baseName", "suffixName") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Aspect" ADD CONSTRAINT "aspect_sectorName_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES "Sector"("baseName", "suffixName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Captain" ADD CONSTRAINT "captain_sector_FK" FOREIGN KEY ("rSectorBaseName", "rSectorSuffixName") REFERENCES "Sector"("baseName", "suffixName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptainAttendance" ADD CONSTRAINT "captainAttendance_regularCaptain_FK" FOREIGN KEY ("captainId") REFERENCES "Captain"("captainId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "CaptainAttendance" ADD CONSTRAINT "captainAttendance_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES "Week"("weekNumber", "termNumber") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "OtherItem" ADD CONSTRAINT "otherItem_financeItem_FK" FOREIGN KEY ("itemId") REFERENCES "FinanceItem"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherItem" ADD CONSTRAINT "otherItem_generalCaptain_FK" FOREIGN KEY ("generalCaptainId") REFERENCES "Captain"("captainId") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RecieveNotification" ADD CONSTRAINT "recNot_captain_FK" FOREIGN KEY ("captainId") REFERENCES "Captain"("captainId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RecieveNotification" ADD CONSTRAINT "recNot_notification_FK" FOREIGN KEY ("notificationId") REFERENCES "Notification"("notificationId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "report_captain_FK" FOREIGN KEY ("captainId") REFERENCES "Captain"("captainId") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "report_scout_FK" FOREIGN KEY ("scoutId") REFERENCES "Scout"("scoutId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Scout" ADD CONSTRAINT "scout_sector_FK" FOREIGN KEY ("sectorSuffixName", "sectorBaseName") REFERENCES "Sector"("suffixName", "baseName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutAttendance" ADD CONSTRAINT "attendance_scout_FK" FOREIGN KEY ("scoutId") REFERENCES "Scout"("scoutId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoutAttendance" ADD CONSTRAINT "attendance_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES "Week"("weekNumber", "termNumber") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "scoutProfile_scout_FK" FOREIGN KEY ("scoutId") REFERENCES "Scout"("scoutId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoutScore" ADD CONSTRAINT "score_aspect_FK" FOREIGN KEY ("aspectId") REFERENCES "Aspect"("aspectId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoutScore" ADD CONSTRAINT "score_scout_FK" FOREIGN KEY ("scoutId") REFERENCES "Scout"("scoutId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "sector_unitCaptain_FK" FOREIGN KEY ("unitCaptainId") REFERENCES "Captain"("captainId") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "session_captain_FK" FOREIGN KEY ("captainId") REFERENCES "Captain"("captainId") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "session_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES "Week"("weekNumber", "termNumber") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "SessionSectorParticipation" ADD CONSTRAINT "SessionParticipation_Sector_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES "Sector"("baseName", "suffixName") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "SessionSectorParticipation" ADD CONSTRAINT "SessionParticipation_Session_FK" FOREIGN KEY ("sessionID") REFERENCES "Session"("sessionId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "subscription_financeItem_FK" FOREIGN KEY ("itemId") REFERENCES "FinanceItem"("itemId") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "subscription_sector_FK" FOREIGN KEY ("sectorBaseName", "sectorSuffixName") REFERENCES "Sector"("baseName", "suffixName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "subscription_week_FK" FOREIGN KEY ("weekNumber", "termNumber") REFERENCES "Week"("weekNumber", "termNumber") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "week_term_FK" FOREIGN KEY ("termNumber") REFERENCES "Term"("termNumber") ON DELETE CASCADE ON UPDATE CASCADE;

