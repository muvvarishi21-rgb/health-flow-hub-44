import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageInfo from '@/components/Common/PageInfo';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  CalendarCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockAppointments, mockPatients, mockDoctors, mockMedicalRecords } from '@/lib/mockData';
import { format } from 'date-fns';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    completedToday: 0,
    totalPatients: 0,
    recentRecords: 0,
  });

  useEffect(() => {
    // Find the current doctor
    const currentDoctor = mockDoctors.find(d => d.userId === user?.id);
    setDoctor(currentDoctor);

    if (currentDoctor) {
      // Get today's appointments for this doctor
      const today = new Date().toDateString();
      const doctorTodayAppointments = mockAppointments.filter(apt => 
        apt.doctorId === currentDoctor.id && 
        new Date(apt.startTime).toDateString() === today
      );

      setTodayAppointments(doctorTodayAppointments);

      // Calculate statistics
      const completedToday = doctorTodayAppointments.filter(apt => 
        apt.status === 'COMPLETED'
      ).length;

      const doctorPatients = new Set(
        mockAppointments
          .filter(apt => apt.doctorId === currentDoctor.id)
          .map(apt => apt.patientId)
      ).size;

      const recentRecords = mockMedicalRecords.filter(record => 
        record.doctorId === currentDoctor.id
      ).length;

      setStats({
        todayAppointments: doctorTodayAppointments.length,
        completedToday,
        totalPatients: doctorPatients,
        recentRecords,
      });
    }
  }, [user]);

  if (!doctor) {
    return <div>Loading doctor information...</div>;
  }

  return (
    <div className="space-y-6">
      <PageInfo
        title="Doctor Dashboard"
        description="Welcome to your medical dashboard. Here you can view your daily schedule, manage patient appointments, and access medical records for your patients."
        example="Check your today's appointments below or click 'View Medical Records' to access patient files."
      />

      {/* Doctor Info Card */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {doctor.fullName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{doctor.fullName}</h2>
              <p className="text-primary-foreground/80">{doctor.specialty}</p>
              <p className="text-sm text-primary-foreground/70">
                Shift: {doctor.shiftStartTime} - {doctor.shiftEndTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              Appointments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Under your care
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.recentRecords}</div>
            <p className="text-xs text-muted-foreground">
              Records created
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/appointments'}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/records'}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm">Medical Records</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/patients'}
            >
              <UserCheck className="h-5 w-5" />
              <span className="text-sm">My Patients</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Today's Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No appointments scheduled for today
            </p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{appointment.patientName}</span>
                      <Badge variant="outline">{appointment.reason}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.startTime), 'HH:mm')} - {format(new Date(appointment.endTime), 'HH:mm')}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;