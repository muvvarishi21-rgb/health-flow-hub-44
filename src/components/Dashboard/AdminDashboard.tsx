import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageInfo from '@/components/Common/PageInfo';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  UserPlus,
  CalendarPlus,
  FileText,
  Activity 
} from 'lucide-react';
import { mockAppointments, mockPatients, mockInvoices, mockDoctors } from '@/lib/mockData';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    unpaidInvoices: 0,
    totalRevenue: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState(mockAppointments.slice(0, 5));

  useEffect(() => {
    // Calculate statistics
    const today = new Date().toDateString();
    
    const todayAppointments = mockAppointments.filter(apt => 
      new Date(apt.startTime).toDateString() === today
    ).length;

    const unpaidInvoices = mockInvoices.filter(inv => 
      inv.status === 'UNPAID' || inv.status === 'PARTIAL'
    ).length;

    const totalRevenue = mockInvoices.reduce((sum, inv) => 
      inv.status === 'PAID' ? sum + inv.amount : sum, 0
    );

    const completedAppointments = mockAppointments.filter(apt => 
      apt.status === 'COMPLETED'
    ).length;

    const cancelledAppointments = mockAppointments.filter(apt => 
      apt.status === 'CANCELLED'
    ).length;

    setStats({
      totalPatients: mockPatients.length,
      todayAppointments,
      unpaidInvoices,
      totalRevenue,
      completedAppointments,
      cancelledAppointments,
    });
  }, []);

  const quickActions = [
    { title: 'Add Patient', icon: UserPlus, href: '/patients', color: 'bg-primary' },
    { title: 'Schedule Appointment', icon: CalendarPlus, href: '/appointments', color: 'bg-success' },
    { title: 'View Reports', icon: FileText, href: '/reports', color: 'bg-info' },
    { title: 'Manage Doctors', icon: Activity, href: '/doctors', color: 'bg-warning' },
  ];

  return (
    <div className="space-y-6">
      <PageInfo
        title="Admin Dashboard"
        description="This is the main administrative control center. Here you can monitor hospital operations, view key metrics, and access management functions for patients, doctors, and appointments."
        example="Try clicking 'Add Patient' to register a new patient or check today's appointments below."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Active patient records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.unpaidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From paid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = action.href}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      Dr. {appointment.doctorName} • {appointment.departmentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(appointment.startTime), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <Badge variant={
                    appointment.status === 'COMPLETED' ? 'default' :
                    appointment.status === 'SCHEDULED' ? 'secondary' : 'destructive'
                  }>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hospital Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Hospital Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Doctors</span>
                <Badge variant="secondary">{mockDoctors.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Completed Appointments</span>
                <Badge variant="default">{stats.completedAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancelled Appointments</span>
                <Badge variant="destructive">{stats.cancelledAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Revenue/Invoice</span>
                <Badge variant="secondary">
                  ${(stats.totalRevenue / Math.max(mockInvoices.length, 1)).toFixed(2)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;