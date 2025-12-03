import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, ExternalLink } from 'lucide-react';
import { Event } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Events() {
  const { events, setEvents } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    attendanceEnabled: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      attendanceEnabled: true,
    });
    setEditingEvent(null);
  };

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        description: event.description,
        startDate: format(event.startDate, 'yyyy-MM-dd'),
        startTime: format(event.startDate, 'HH:mm'),
        endDate: format(event.endDate, 'yyyy-MM-dd'),
        endTime: format(event.endDate, 'HH:mm'),
        attendanceEnabled: event.attendanceEnabled,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Event = {
      id: editingEvent?.id || `evt-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      startDate: new Date(`${formData.startDate}T${formData.startTime}`),
      endDate: new Date(`${formData.endDate}T${formData.endTime}`),
      attendanceEnabled: formData.attendanceEnabled,
      type: 'event',
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? newEvent : e));
      toast.success('Event updated successfully');
    } else {
      setEvents([...events, newEvent]);
      toast.success('Event created successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="mt-1 text-muted-foreground">Manage and create events</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? 'Update the event details below.' : 'Fill in the details for the new event.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Event Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <Label htmlFor="attendance" className="text-sm font-medium">Enable Attendance</Label>
                      <p className="text-xs text-muted-foreground">Allow attendance tracking for this event</p>
                    </div>
                    <Switch
                      id="attendance"
                      checked={formData.attendanceEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, attendanceEnabled: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEvent ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground">All Events</h2>
            <p className="text-sm text-muted-foreground">Manage your events and attendance settings</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date & Time</TableHead>
                <TableHead>End Date & Time</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {event.description}
                  </TableCell>
                  <TableCell>
                    {format(event.startDate, 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    {format(event.endDate, 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.attendanceEnabled ? 'success' : 'secondary'}>
                      {event.attendanceEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(event)}
                      >
                        <Pencil className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      {event.attendanceEnabled && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
