import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageInfo from '@/components/Common/PageInfo';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  User,
  CalendarPlus,
  Eye,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockAppointments, mockPatients, mockMedicalRecords, mockInvoices } from '@/lib/mockData';
import { format } from 'date-fns';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalRecords: 0,
    unpaidAmount: 0,
  });

  useEffect(() => {
    // Find the current patient
    const currentPatient = mockPatients.find(p => p.userId === user?.id);
    setPatient(currentPatient);

    if (currentPatient) {
      // Get patient's appointments
      const patientAppointments = mockAppointments.filter(apt => 
        apt.patientId === currentPatient.id
      );

      // Find next upcoming appointment
      const upcoming = patientAppointments
        .filter(apt => new Date(apt.startTime) > new Date() && apt.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

      setNextAppointment(upcoming || null);

      // Get recent medical records
      const patientRecords = mockMedicalRecords
        .filter(record => record.patientId === currentPatient.id)
        .slice(0, 3);
      
      setRecentRecords(patientRecords);

      // Get unpaid invoices
      const patientUnpaidInvoices = mockInvoices.filter(inv => 
        inv.patientId === currentPatient.id && 
        (inv.status === 'UNPAID' || inv.status === 'PARTIAL')
      );
      
      setUnpaidInvoices(patientUnpaidInvoices);

      // Calculate statistics
      const upcomingCount = patientAppointments.filter(apt => 
        new Date(apt.startTime) > new Date() && apt.status === 'SCHEDULED'
      ).length;

      const totalRecords = mockMedicalRecords.filter(record => 
        record.patientId === currentPatient.id
      ).length;

      const unpaidAmount = patientUnpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

      setStats({
        upcomingAppointments: upcomingCount,
        totalRecords,
        unpaidAmount,
      });
    }
  }, [user]);

  if (!patient) {
    return <div>Loading patient information...</div>;
  }

  return (
    <div className="space-y-6">
      <PageInfo
        title="Patient Dashboard"
        description="Welcome to your personal health dashboard. Here you can view your upcoming appointments, medical records, billing information, and manage your profile."
        example="Try booking a new appointment or check your medical records below."
      />

      {/* Patient Info Card */}
      <Card className="bg-gradient-secondary">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-secondary-foreground">
                {patient.fullName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-foreground">{patient.fullName}</h2>
              <p className="text-secondary-foreground/80">Patient ID: #{patient.id}</p>
              <p className="text-sm text-secondary-foreground/70">
                Blood Group: {patient.bloodGroup} • DOB: {format(new Date(patient.dob), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Available records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${stats.unpaidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Unpaid invoices
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
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/appointments'}
            >
              <CalendarPlus className="h-5 w-5" />
              <span className="text-sm">Book Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/records'}
            >
              <Eye className="h-5 w-5" />
              <span className="text-sm">View Records</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/billing'}
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Pay Bills</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/profile'}
            >
              <User className="h-5 w-5" />
              <span className="text-sm">Update Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointment */}
        <Card>
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-accent/20">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{nextAppointment.doctorName}</span>
                      <Badge variant="secondary">{nextAppointment.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {nextAppointment.departmentName}
                    </p>
                    <p className="text-sm font-medium">
                      {format(new Date(nextAppointment.startTime), 'EEE, MMM dd, yyyy')}
                    </p>
                    <p className="text-sm">
                      {format(new Date(nextAppointment.startTime), 'HH:mm')} - {format(new Date(nextAppointment.endTime), 'HH:mm')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reason: {nextAppointment.reason}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button onClick={() => window.location.href = '/appointments'}>
                  Book New Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{record.doctorName}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(record.visitDate), 'MMM dd')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Diagnosis: {record.diagnosis}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {record.notes.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Records
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No medical records available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unpaid Invoices */}
      {unpaidInvoices.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="text-warning">Outstanding Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unpaidInvoices.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Invoice #{invoice.id}</span>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(invoice.dueAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                    <Badge variant="destructive">{invoice.status}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="default" className="w-full">
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientDashboard;