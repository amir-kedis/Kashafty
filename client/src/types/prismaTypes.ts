export enum ActivityType {
  entertainment = "entertainment",
  rowing = "rowing",
  camping = "camping",
  wildCooking = "wildCooking",
  scouting = "scouting",
  volunteering = "volunteering",
  other = "other",
}

export enum AspectCategory {
  scoutingSkills = "scoutingSkills",
  behaviour = "behaviour",
  participation = "participation",
  exams = "exams",
  other = "other",
}

export enum AttendanceStatus {
  absent = "absent",
  execused = "execused",
  termExecused = "termExecused",
  attended = "attended",
}

export enum CaptainType {
  general = "general",
  unit = "unit",
  regular = "regular",
}

export enum Days {
  sat = "sat",
  sun = "sun",
  mon = "mon",
  tue = "tue",
  wed = "wed",
  thu = "thu",
  fri = "fri",
}

export enum FinanceItemType {
  income = "income",
  expense = "expense",
}

export enum Gender {
  male = "male",
  female = "female",
}

export enum NotificationStatus {
  read = "read",
  unread = "unread",
  archived = "archived",
}

export enum NotificationType {
  attendance = "attendance",
  report = "report",
  financeItemCreated = "financeItemCreated",
  other = "other",
}

export interface Activity {
  activityId: number;
  place?: string;
  weekNumber: number;
  termNumber: number;
  day: Days;
  type: ActivityType;
  name: string;
}

export interface ActivityAttendance {
  scoutId: number;
  activityId: number;
  score?: number;
  attendanceStatus: AttendanceStatus;
}

export interface ActivityGuidance {
  activityId: number;
  captainId: number;
}

export interface ActivitySectorParticipation {
  activityId: number;
  sectorBaseName: string;
  sectorSuffixName: string;
}

export interface Aspect {
  aspectId: number;
  name: string;
  sectorBaseName: string;
  sectorSuffixName: string;
  category: AspectCategory;
}

export interface Captain {
  captainId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  rSectorBaseName?: string;
  rSectorSuffixName?: string;
  gender: Gender;
  type: CaptainType;
}

export interface CaptainAttendance {
  captainId: number;
  weekNumber: number;
  termNumber: number;
  attendanceStatus: AttendanceStatus;
}

export interface FinanceItem {
  itemId: number;
  value: number;
  timestamp: Date;
  type: FinanceItemType;
}

export interface Notification {
  notificationId: number;
  timestamp: Date;
  message: string;
  contentType: NotificationType;
}

export interface OtherItem {
  description: string;
  itemId: number;
  generalCaptainId?: number;
}

export interface RecieveNotification {
  notificationId: number;
  captainId: number;
  status?: string;
}

export interface Report {
  reportId: number;
  info: string;
  date: Date;
  captainId?: number;
  scoutId: number;
}

export interface Scout {
  scoutId: number;
  firstName: string;
  middleName: string;
  lastName?: string;
  expelled: boolean;
  sectorBaseName?: string;
  sectorSuffixName?: string;
  gender?: Gender;
}

export interface ScoutAttendance {
  scoutId: number;
  weekNumber: number;
  termNumber: number;
  attendanceStatus: AttendanceStatus;
}

export interface ScoutProfile {
  birthCertificate?: string;
  birthDate?: Date;
  enrollDate?: Date;
  photo?: string;
  scoutId: number;
  schoolGrade?: number;
}

export interface ScoutScore {
  scoutId: number;
  aspectId: number;
  score: number;
  timestamp: Date;
}

export interface Sector {
  baseName: string;
  suffixName: string;
  unitCaptainId?: number;
}

export interface Session {
  sessionId: number;
  title: string;
  documentURL?: string;
  captainId?: number;
  weekNumber: number;
  termNumber: number;
}

export interface SessionSectorParticipation {
  sessionID: number;
  sectorBaseName: string;
  sectorSuffixName: string;
}

export interface Subscription {
  itemId: number;
  sectorBaseName?: string;
  sectorSuffixName?: string;
  weekNumber: number;
  termNumber: number;
}

export interface Term {
  termNumber: number;
  termName?: string;
  startDate: Date;
  endDate: Date;
}

export interface Week {
  weekNumber: number;
  cancelled: boolean;
  startDate: Date;
  termNumber: number;
}
