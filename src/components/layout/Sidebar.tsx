import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  ClipboardCheck, 
  Users,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['HR'] },
  { title: 'Events', href: '/events', icon: Calendar, roles: ['HR'] },
  { title: 'Weekly Class', href: '/weekly-class', icon: BookOpen, roles: ['HR'] },
  { title: 'Fill Attendance', href: '/fill-attendance', icon: ClipboardCheck, roles: ['HR', 'Penanggung Jawab Piket'] },
  { title: 'View Absences', href: '/absences', icon: Users, roles: ['HR'] },
];

export function Sidebar() {
  const { userRole, setUserRole } = useApp();

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold">KSPM UMB</span>
        </div>

        {/* Role Selector */}
        <div className="px-4 py-4">
          <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Penanggung Jawab Piket">Penanggung Jawab Piket</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
            Menu
          </p>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-muted">
            © 2025 KSPM UMB
          </p>
        </div>
      </div>
    </aside>
  );
}
