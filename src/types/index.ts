export type UserRole = 'HR' | 'Penanggung Jawab Piket';

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  attendanceEnabled: boolean;
  type: 'event';
}

export interface WeeklyClass {
  id: string;
  name: string;
  topic: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'weekly-class';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  department: string;
}

export type AttendanceStatus = 'On time' | 'Late' | 'Not Marked';

export interface AttendanceRecord {
  id: string;
  participantId: string;
  participantName: string;
  eventId: string;
  eventType: 'event' | 'weekly-class';
  isPresent: boolean;
  status: AttendanceStatus;
  checkInTime?: Date;
}

export interface AttendanceSummary {
  eventId: string;
  eventName: string;
  eventDescription: string;
  eventDate: Date;
  eventType: 'event' | 'weekly-class';
  totalParticipants: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}

export interface IndividualAttendance {
  participantId: string;
  participantName: string;
  totalEvents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  isBelowThreshold: boolean;
}

export interface MonthlyAttendance {
  month: string;
  percentage: number;
  totalEvents: number;
}
