import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users,
    roles: ['ADMIN', 'DOCTOR'],
  },
  {
    title: 'My Profile',
    href: '/profile',
    icon: Users,
    roles: ['PATIENT'],
  },
  {
    title: 'Doctors',
    href: '/doctors',
    icon: Stethoscope,
    roles: ['ADMIN'],
  },
  {
    title: 'Departments',
    href: '/departments',
    icon: Building2,
    roles: ['ADMIN'],
  },
  {
    title: 'Appointments',
    href: '/appointments',
    icon: Calendar,
  },
  {
    title: 'Medical Records',
    href: '/records',
    icon: FileText,
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['ADMIN'],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">HAMS</h1>
            <p className="text-sm text-muted-foreground">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-medical'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className={cn(
                'mr-3 h-5 w-5 transition-colors',
                isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground group-hover:text-foreground'
              )} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {user?.fullName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;