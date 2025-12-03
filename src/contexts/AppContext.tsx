import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Event, WeeklyClass, AttendanceRecord, Participant } from '@/types';
import { mockEvents, mockWeeklyClasses, mockAttendanceRecords, mockParticipants } from '@/data/mockData';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  weeklyClasses: WeeklyClass[];
  setWeeklyClasses: React.Dispatch<React.SetStateAction<WeeklyClass[]>>;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  participants: Participant[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('HR');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [weeklyClasses, setWeeklyClasses] = useState<WeeklyClass[]>(mockWeeklyClasses);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const participants = mockParticipants;

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        events,
        setEvents,
        weeklyClasses,
        setWeeklyClasses,
        attendanceRecords,
        setAttendanceRecords,
        participants,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
