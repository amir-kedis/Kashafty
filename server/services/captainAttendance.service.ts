import AttendanceRecord from "../types/AttendanceRecord";
import { prisma } from "../database/db";
import { AttendanceStatus } from "@prisma/client";


class AttendanceService {

    static async upsertSignleAttendance(record: AttendanceRecord) : Promise<any> {

        const attendanceRecord = await prisma.captainAttendance.upsert({
            where: {
              captainId_weekNumber_termNumber: {
                captainId: parseInt(record.captainId),
                weekNumber: record.weekNumber,
                termNumber: record.termNumber,
              },
            },
            update: {
              attendanceStatus: record.attendanceStatus as AttendanceStatus,
            },
            create: {
              captainId: parseInt(record.captainId),
              weekNumber: record.weekNumber,
              termNumber: record.termNumber,
              attendanceStatus: record.attendanceStatus as AttendanceStatus,
            },
        });

        return attendanceRecord;
    }


    static async upsertManyAttendance(records: AttendanceRecord[]) : Promise<any> {

        const result = [];

        for (let i = 0; i < records.length; i++){
            const singleResult = AttendanceService.upsertSignleAttendance(records[i]);
            result.push(singleResult);
        }


        return result;
    }


}

export default AttendanceService;
