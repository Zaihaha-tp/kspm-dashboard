import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Download, Calendar, Users, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockIndividualAttendance } from '@/data/mockData';

const ATTENDANCE_THRESHOLD = 75;

export default function Absences() {
  const { events, weeklyClasses, attendanceRecords, participants } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Calculate attendance summaries
  const eventSummaries = useMemo(() => {
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

    const allEvents = [...eventsWithAttendance, ...weeklyClassEvents];

    return allEvents.map(event => {
      const records = attendanceRecords.filter(r => r.eventId === event.id);
      const presentCount = records.filter(r => r.isPresent).length;
      const totalParticipants = participants.length;
      const absentCount = totalParticipants - presentCount;
      const percentage = totalParticipants > 0 
        ? Math.round((presentCount / totalParticipants) * 100) 
        : 0;

      return {
        ...event,
        presentCount,
        absentCount,
        totalParticipants,
        percentage,
      };
    });
  }, [events, weeklyClasses, attendanceRecords, participants]);

  const selectedEventRecords = useMemo(() => {
    if (!selectedEventId) return [];
    return attendanceRecords.filter(r => r.eventId === selectedEventId);
  }, [selectedEventId, attendanceRecords]);

  const handleViewDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsViewDialogOpen(true);
  };

  const handleExport = (eventId: string) => {
    const event = eventSummaries.find(e => e.id === eventId);
    if (!event) return;

    const records = attendanceRecords.filter(r => r.eventId === eventId);
    
    // Create CSV content
    const headers = ['Name', 'Present', 'Status', 'Check-in Time'];
    const rows = participants.map(p => {
      const record = records.find(r => r.participantId === p.id);
      return [
        p.name,
        record?.isPresent ? 'Yes' : 'No',
        record?.status || 'Not Marked',
        record?.checkInTime ? format(record.checkInTime, 'HH:mm') : '-',
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${event.name}-${format(event.date, 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Absences Overview</h1>
          <p className="mt-1 text-muted-foreground">View attendance records for all events</p>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              By Event
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Individual Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Events with Attendance</h2>
                <p className="text-sm text-muted-foreground">View and export attendance records</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventSummaries.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {event.description}
                      </TableCell>
                      <TableCell>
                        {format(event.date, 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success">{event.presentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">{event.absentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={event.percentage >= ATTENDANCE_THRESHOLD ? 'success' : 'warning'}
                        >
                          {event.percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(event.id)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(event.id)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">Individual Attendance Report</h2>
                  <Badge variant="outline" className="text-xs">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Threshold: {ATTENDANCE_THRESHOLD}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cumulative attendance percentage per individual. Members below threshold are highlighted in red.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Total Events</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Attendance %</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIndividualAttendance.map((record) => (
                    <TableRow 
                      key={record.participantId}
                      className={cn(
                        record.isBelowThreshold && 'bg-destructive/10'
                      )}
                    >
                      <TableCell className={cn(
                        'font-medium',
                        record.isBelowThreshold && 'text-destructive'
                      )}>
                        {record.participantName}
                      </TableCell>
                      <TableCell className="text-center">{record.totalEvents}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success">{record.presentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">{record.absentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          'font-semibold',
                          record.isBelowThreshold ? 'text-destructive' : 'text-success'
                        )}>
                          {record.attendancePercentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {record.isBelowThreshold ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Below Threshold
                          </Badge>
                        ) : (
                          <Badge variant="success">Good Standing</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Attendance Details - {eventSummaries.find(e => e.id === selectedEventId)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-in Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => {
                    const record = selectedEventRecords.find(r => r.participantId === participant.id);
                    return (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={record?.isPresent ? 'success' : 'destructive'}>
                            {record?.isPresent ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            record?.status === 'On time' ? 'success' : 
                            record?.status === 'Late' ? 'warning' : 'secondary'
                          }>
                            {record?.status || 'Not Marked'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record?.checkInTime ? (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(record.checkInTime, 'HH:mm')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
