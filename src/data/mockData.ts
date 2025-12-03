import { Event, WeeklyClass, Participant, AttendanceRecord, AttendanceSummary, IndividualAttendance, MonthlyAttendance } from '@/types';

export const mockParticipants: Participant[] = [
  { id: '1', name: 'Ahmad Fauzi', email: 'ahmad@umb.ac.id', department: 'KMP' },
  { id: '2', name: 'Budi Santoso', email: 'budi@umb.ac.id', department: 'KMP' },
  { id: '3', name: 'Citra Dewi', email: 'citra@umb.ac.id', department: 'KMP' },
  { id: '4', name: 'Dewi Lestari', email: 'dewi@umb.ac.id', department: 'KMP' },
  { id: '5', name: 'Eko Prasetyo', email: 'eko@umb.ac.id', department: 'KMP' },
  { id: '6', name: 'Fitri Handayani', email: 'fitri@umb.ac.id', department: 'KMP' },
  { id: '7', name: 'Gunawan Wibowo', email: 'gunawan@umb.ac.id', department: 'KMP' },
  { id: '8', name: 'Hana Permata', email: 'hana@umb.ac.id', department: 'KMP' },
  { id: '9', name: 'Indra Kusuma', email: 'indra@umb.ac.id', department: 'KMP' },
  { id: '10', name: 'Joko Widodo', email: 'joko@umb.ac.id', department: 'KMP' },
  { id: '11', name: 'Kartika Sari', email: 'kartika@umb.ac.id', department: 'KMP' },
  { id: '12', name: 'Lina Marlina', email: 'lina@umb.ac.id', department: 'KMP' },
];

export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    name: 'Monthly Team Meeting',
    description: 'Regular monthly meeting for all staff',
    startDate: new Date('2025-11-20T09:00:00'),
    endDate: new Date('2025-11-20T11:00:00'),
    attendanceEnabled: true,
    type: 'event',
  },
  {
    id: 'evt-2',
    name: 'Training Workshop',
    description: 'Professional development workshop',
    startDate: new Date('2025-11-25T13:00:00'),
    endDate: new Date('2025-11-25T16:00:00'),
    attendanceEnabled: true,
    type: 'event',
  },
  {
    id: 'evt-3',
    name: 'Company Announcement',
    description: 'Important company-wide announcement',
    startDate: new Date('2025-11-30T10:00:00'),
    endDate: new Date('2025-11-30T10:30:00'),
    attendanceEnabled: false,
    type: 'event',
  },
];

export const mockWeeklyClasses: WeeklyClass[] = [
  {
    id: 'wc-1',
    name: 'Kelas Mingguan - Week 1',
    topic: 'Pengenalan Dasar Pemrograman',
    description: 'Pertemuan minggu pertama membahas dasar-dasar pemrograman',
    date: new Date('2025-11-18'),
    startTime: '14:00',
    endTime: '16:00',
    type: 'weekly-class',
  },
  {
    id: 'wc-2',
    name: 'Kelas Mingguan - Week 2',
    topic: 'Struktur Data & Algoritma',
    description: 'Pembahasan struktur data fundamental',
    date: new Date('2025-11-25'),
    startTime: '14:00',
    endTime: '16:00',
    type: 'weekly-class',
  },
  {
    id: 'wc-3',
    name: 'Kelas Mingguan - Week 3',
    topic: 'Database & SQL Dasar',
    description: 'Pengenalan database relasional dan SQL',
    date: new Date('2025-12-02'),
    startTime: '14:00',
    endTime: '16:00',
    type: 'weekly-class',
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  // Event 1 attendance
  { id: 'ar-1', participantId: '1', participantName: 'Ahmad Fauzi', eventId: 'evt-1', eventType: 'event', isPresent: true, status: 'On time', checkInTime: new Date('2025-11-20T08:55:00') },
  { id: 'ar-2', participantId: '2', participantName: 'Budi Santoso', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  { id: 'ar-3', participantId: '3', participantName: 'Citra Dewi', eventId: 'evt-1', eventType: 'event', isPresent: true, status: 'On time', checkInTime: new Date('2025-11-20T08:58:00') },
  { id: 'ar-4', participantId: '4', participantName: 'Dewi Lestari', eventId: 'evt-1', eventType: 'event', isPresent: true, status: 'Late', checkInTime: new Date('2025-11-20T09:15:00') },
  { id: 'ar-5', participantId: '5', participantName: 'Eko Prasetyo', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  { id: 'ar-6', participantId: '6', participantName: 'Fitri Handayani', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  { id: 'ar-7', participantId: '7', participantName: 'Gunawan Wibowo', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  { id: 'ar-8', participantId: '8', participantName: 'Hana Permata', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  { id: 'ar-9', participantId: '9', participantName: 'Indra Kusuma', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  { id: 'ar-10', participantId: '10', participantName: 'Joko Widodo', eventId: 'evt-1', eventType: 'event', isPresent: false, status: 'Not Marked' },
  
  // Weekly Class 1 attendance
  { id: 'ar-11', participantId: '1', participantName: 'Ahmad Fauzi', eventId: 'wc-1', eventType: 'weekly-class', isPresent: true, status: 'On time', checkInTime: new Date('2025-11-18T13:55:00') },
  { id: 'ar-12', participantId: '2', participantName: 'Budi Santoso', eventId: 'wc-1', eventType: 'weekly-class', isPresent: true, status: 'On time', checkInTime: new Date('2025-11-18T13:58:00') },
  { id: 'ar-13', participantId: '3', participantName: 'Citra Dewi', eventId: 'wc-1', eventType: 'weekly-class', isPresent: true, status: 'Late', checkInTime: new Date('2025-11-18T14:10:00') },
  { id: 'ar-14', participantId: '4', participantName: 'Dewi Lestari', eventId: 'wc-1', eventType: 'weekly-class', isPresent: false, status: 'Not Marked' },
  { id: 'ar-15', participantId: '5', participantName: 'Eko Prasetyo', eventId: 'wc-1', eventType: 'weekly-class', isPresent: true, status: 'On time', checkInTime: new Date('2025-11-18T13:50:00') },
];

export const mockAttendanceSummaries: AttendanceSummary[] = [
  {
    eventId: 'evt-1',
    eventName: 'Monthly Team Meeting',
    eventDescription: 'Regular monthly meeting for all staff',
    eventDate: new Date('2025-11-20T09:00:00'),
    eventType: 'event',
    totalParticipants: 10,
    presentCount: 3,
    absentCount: 7,
    attendancePercentage: 30,
  },
  {
    eventId: 'evt-2',
    eventName: 'Training Workshop',
    eventDescription: 'Professional development workshop',
    eventDate: new Date('2025-11-25T13:00:00'),
    eventType: 'event',
    totalParticipants: 10,
    presentCount: 0,
    absentCount: 10,
    attendancePercentage: 0,
  },
  {
    eventId: 'wc-1',
    eventName: 'Kelas Mingguan - Week 1',
    eventDescription: 'Pertemuan minggu pertama membahas dasar-dasar pemrograman',
    eventDate: new Date('2025-11-18T14:00:00'),
    eventType: 'weekly-class',
    totalParticipants: 12,
    presentCount: 8,
    absentCount: 4,
    attendancePercentage: 67,
  },
];

export const mockIndividualAttendance: IndividualAttendance[] = [
  { participantId: '1', participantName: 'Ahmad Fauzi', totalEvents: 10, presentCount: 9, absentCount: 1, attendancePercentage: 90, isBelowThreshold: false },
  { participantId: '2', participantName: 'Budi Santoso', totalEvents: 10, presentCount: 7, absentCount: 3, attendancePercentage: 70, isBelowThreshold: true },
  { participantId: '3', participantName: 'Citra Dewi', totalEvents: 10, presentCount: 8, absentCount: 2, attendancePercentage: 80, isBelowThreshold: false },
  { participantId: '4', participantName: 'Dewi Lestari', totalEvents: 10, presentCount: 6, absentCount: 4, attendancePercentage: 60, isBelowThreshold: true },
  { participantId: '5', participantName: 'Eko Prasetyo', totalEvents: 10, presentCount: 5, absentCount: 5, attendancePercentage: 50, isBelowThreshold: true },
  { participantId: '6', participantName: 'Fitri Handayani', totalEvents: 10, presentCount: 10, absentCount: 0, attendancePercentage: 100, isBelowThreshold: false },
  { participantId: '7', participantName: 'Gunawan Wibowo', totalEvents: 10, presentCount: 8, absentCount: 2, attendancePercentage: 80, isBelowThreshold: false },
  { participantId: '8', participantName: 'Hana Permata', totalEvents: 10, presentCount: 7, absentCount: 3, attendancePercentage: 70, isBelowThreshold: true },
];

export const mockMonthlyAttendance: MonthlyAttendance[] = [
  { month: 'Jul', percentage: 85, totalEvents: 4 },
  { month: 'Aug', percentage: 78, totalEvents: 5 },
  { month: 'Sep', percentage: 82, totalEvents: 4 },
  { month: 'Oct', percentage: 75, totalEvents: 6 },
  { month: 'Nov', percentage: 68, totalEvents: 5 },
  { month: 'Dec', percentage: 72, totalEvents: 3 },
];
