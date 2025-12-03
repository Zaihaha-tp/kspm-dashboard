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
import { Plus, Pencil, BookOpen } from 'lucide-react';
import { WeeklyClass as WeeklyClassType } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function WeeklyClass() {
  const { weeklyClasses, setWeeklyClasses } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<WeeklyClassType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      topic: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
    });
    setEditingClass(null);
  };

  const handleOpenDialog = (weeklyClass?: WeeklyClassType) => {
    if (weeklyClass) {
      setEditingClass(weeklyClass);
      setFormData({
        name: weeklyClass.name,
        topic: weeklyClass.topic,
        description: weeklyClass.description,
        date: format(weeklyClass.date, 'yyyy-MM-dd'),
        startTime: weeklyClass.startTime,
        endTime: weeklyClass.endTime,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClass: WeeklyClassType = {
      id: editingClass?.id || `wc-${Date.now()}`,
      name: formData.name,
      topic: formData.topic,
      description: formData.description,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: 'weekly-class',
    };

    if (editingClass) {
      setWeeklyClasses(weeklyClasses.map(c => c.id === editingClass.id ? newClass : c));
      toast.success('Weekly class updated successfully');
    } else {
      setWeeklyClasses([...weeklyClasses, newClass]);
      toast.success('Weekly class created successfully');
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
            <h1 className="text-3xl font-bold text-foreground">Weekly Class</h1>
            <p className="mt-1 text-muted-foreground">Manage weekly class sessions and topics</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingClass ? 'Edit Session' : 'Create Session'}</DialogTitle>
                  <DialogDescription>
                    {editingClass ? 'Update the session details below.' : 'Fill in the details for the new weekly class session.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Session Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Kelas Mingguan - Week 4"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="topic" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-info" />
                      Topic / Material
                    </Label>
                    <Input
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g., Web Development Fundamentals"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Specify the topic or material to be covered in this session
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Additional details about this session"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingClass ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Weekly Classes Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground">All Sessions</h2>
            <p className="text-sm text-muted-foreground">View and manage weekly class sessions with their topics</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Name</TableHead>
                <TableHead>Topic / Material</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyClasses.map((wc) => (
                <TableRow key={wc.id}>
                  <TableCell className="font-medium">{wc.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="info" className="font-normal">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {wc.topic}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(wc.date, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {wc.startTime} - {wc.endTime}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(wc)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
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
