import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CheckCheck, ClipboardCheck, Clock, ArrowLeft } from 'lucide-react';
import { AttendanceStatus } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AttendanceItem {
  participantId: string;
  participantName: string;
  isPresent: boolean;
  status: AttendanceStatus;
  checkInTime?: string;
}

export default function FillAttendance() {
  const { events, weeklyClasses, participants, attendanceRecords, setAttendanceRecords } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);

  // Combine events and weekly classes that have attendance enabled
  const allEvents = useMemo(() => {
    const eventsWithAttendance = events.filter(e => e.attendanceEnabled).map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      date: e.startDate,
      type: 'event' as const,
    }));
    
    const weeklyClassEvents = weeklyClasses.map(wc => ({
      id: wc.id,
      name: wc.name,
      description: wc.topic,
      date: wc.date,
      type: 'weekly-class' as const,
    }));

    return [...eventsWithAttendance, ...weeklyClassEvents];
  }, [events, weeklyClasses]);

  const selectedEvent = allEvents.find(e => e.id === selectedEventId);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    
    // Initialize attendance data for all participants
    const existingRecords = attendanceRecords.filter(r => r.eventId === eventId);
    
    const initialData: AttendanceItem[] = participants.map(p => {
      const existing = existingRecords.find(r => r.participantId === p.id);
      return {
        participantId: p.id,
        participantName: p.name,
        isPresent: existing?.isPresent || false,
        status: existing?.status || 'Not Marked',
        checkInTime: existing?.checkInTime ? format(existing.checkInTime, 'HH:mm') : '',
      };
    });
    
    setAttendanceData(initialData);
  };

  const filteredAttendance = useMemo(() => {
    if (!searchQuery) return attendanceData;
    return attendanceData.filter(a => 
      a.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [attendanceData, searchQuery]);

  const handleMarkAllPresent = () => {
    setAttendanceData(prev => prev.map(a => ({
      ...a,
      isPresent: true,
      status: 'On time',
      checkInTime: a.checkInTime || format(new Date(), 'HH:mm'),
    })));
    toast.success('All participants marked as present');
  };

  const handleTogglePresent = (participantId: string, isPresent: boolean) => {
    setAttendanceData(prev => prev.map(a => {
      if (a.participantId === participantId) {
        return {
          ...a,
          isPresent,
          status: isPresent ? 'On time' : 'Not Marked',
          checkInTime: isPresent ? (a.checkInTime || format(new Date(), 'HH:mm')) : '',
        };
      }
      return a;
    }));
  };

  const handleStatusChange = (participantId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => prev.map(a => {
      if (a.participantId === participantId) {
        return { ...a, status };
      }
      return a;
    }));
  };

  const handleCheckInTimeChange = (participantId: string, time: string) => {
    setAttendanceData(prev => prev.map(a => {
      if (a.participantId === participantId) {
        return { ...a, checkInTime: time };
      }
      return a;
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedEventId || !selectedEvent) return;

    const newRecords = attendanceData.map(a => ({
      id: `ar-${selectedEventId}-${a.participantId}`,
      participantId: a.participantId,
      participantName: a.participantName,
      eventId: selectedEventId,
      eventType: selectedEvent.type,
      isPresent: a.isPresent,
      status: a.status,
      checkInTime: a.checkInTime ? new Date(`${format(selectedEvent.date, 'yyyy-MM-dd')}T${a.checkInTime}`) : undefined,
    }));

    // Update or add records
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => r.eventId !== selectedEventId);
      return [...filtered, ...newRecords];
    });

    toast.success('Attendance saved successfully');
  };

  const presentCount = attendanceData.filter(a => a.isPresent).length;

  if (!selectedEventId) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fill Attendance</h1>
            <p className="mt-1 text-muted-foreground">Select an event and fill attendance for penanggung jawab piket</p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground">Events</h2>
              <p className="text-sm text-muted-foreground">Click "Fill Attendance" to view and mark attendance</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allEvents.map((event) => {
                  const records = attendanceRecords.filter(r => r.eventId === event.id);
                  const present = records.filter(r => r.isPresent).length;
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(event.date, 'MM/dd/yyyy, h:mm:ss a')}
                      </TableCell>
                      <TableCell>
                        {present}/{participants.length}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectEvent(event.id)}
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            className="w-fit" 
            onClick={() => setSelectedEventId(null)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Attendance for {selectedEvent?.name}
            </h1>
            <p className="mt-1 text-muted-foreground">Mark present and select status for each user</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search participant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {presentCount}/{attendanceData.length} Present
            </Badge>
            <Button variant="outline" onClick={handleMarkAllPresent}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Present
            </Button>
            <Button onClick={handleSaveAttendance}>
              Save Attendance
            </Button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((attendance, index) => (
                <TableRow 
                  key={attendance.participantId}
                  className={cn(
                    !attendance.isPresent && 'bg-destructive/5'
                  )}
                >
                  <TableCell className="font-medium">{attendance.participantName}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={attendance.isPresent}
                      onCheckedChange={(checked) => 
                        handleTogglePresent(attendance.participantId, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={attendance.checkInTime}
                        onChange={(e) => handleCheckInTimeChange(attendance.participantId, e.target.value)}
                        className="w-32"
                        disabled={!attendance.isPresent}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={attendance.status}
                      onValueChange={(value: AttendanceStatus) => 
                        handleStatusChange(attendance.participantId, value)
                      }
                      disabled={!attendance.isPresent}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="On time">On time</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Not Marked">Not Marked</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
