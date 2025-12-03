import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Users, TrendingUp, BookOpen } from 'lucide-react';
import { mockMonthlyAttendance, mockAttendanceSummaries } from '@/data/mockData';

export default function Dashboard() {
  const { events, weeklyClasses } = useApp();

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const currentMonthData = mockMonthlyAttendance.find(m => m.month === currentMonth) || mockMonthlyAttendance[mockMonthlyAttendance.length - 1];

  const totalEventsThisMonth = events.length + weeklyClasses.length;
  const avgAttendance = mockAttendanceSummaries.length > 0
    ? Math.round(mockAttendanceSummaries.reduce((acc, s) => acc + s.attendancePercentage, 0) / mockAttendanceSummaries.length)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here's an overview of your attendance data.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Events This Month"
            value={totalEventsThisMonth}
            subtitle="Events + Weekly Classes"
            icon={Calendar}
            variant="info"
          />
          <StatCard
            title="Weekly Classes"
            value={weeklyClasses.length}
            subtitle="Active classes"
            icon={BookOpen}
            variant="default"
          />
          <StatCard
            title="Average Attendance"
            value={`${avgAttendance}%`}
            subtitle="Across all events"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Total Participants"
            value={12}
            subtitle="Registered members"
            icon={Users}
            variant="default"
          />
        </div>

        {/* Chart Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
            <p className="text-sm text-muted-foreground mb-6">Current month overview</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{currentMonthData.percentage}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-info/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-info" />
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold text-foreground">{currentMonthData.totalEvents}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  * Threshold alert: Members below 75% attendance are flagged
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
