import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { mockMonthlyAttendance } from '@/data/mockData';

export function AttendanceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Attendance Trend</h3>
        <p className="text-sm text-muted-foreground">Monthly attendance percentage over the last 6 months</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={mockMonthlyAttendance} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value}%`, 'Attendance']}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="none"
              fill="url(#colorPercentage)"
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
              activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2, fill: '#ffffff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
