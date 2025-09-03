import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/Layout/MainLayout';
import PageInfo from '@/components/Common/PageInfo';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, Plus, Search, Filter, Eye, Trash2 } from 'lucide-react';
import { mockAppointments, mockDoctors, mockDepartments, mockPatients } from '@/lib/mockData';
import { format } from 'date-fns';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    patientId: user?.role === 'PATIENT' ? user.patientId || '' : '',
    doctorId: '',
    departmentId: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    // Filter appointments based on user role
    let filtered = appointments;
    
    if (user?.role === 'PATIENT') {
      const currentPatient = mockPatients.find(p => p.userId === user.id);
      if (currentPatient) {
        filtered = appointments.filter(apt => apt.patientId === currentPatient.id);
      }
    } else if (user?.role === 'DOCTOR') {
      const currentDoctor = mockDoctors.find(d => d.userId === user.id);
      if (currentDoctor) {
        filtered = appointments.filter(apt => apt.doctorId === currentDoctor.id);
      }
    }

    // Apply search and status filters
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter.toUpperCase());
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, user]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.doctorId || !bookingForm.date || !bookingForm.time) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Simulate booking validation (check for conflicts)
    const appointmentDateTime = new Date(`${bookingForm.date}T${bookingForm.time}`);
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    const doctor = mockDoctors.find(d => d.id === bookingForm.doctorId);
    const patient = user?.role === 'PATIENT' 
      ? mockPatients.find(p => p.userId === user.id)
      : mockPatients.find(p => p.id === bookingForm.patientId);
    const department = mockDepartments.find(d => d.id === bookingForm.departmentId);

    if (!doctor || !patient || !department) {
      toast({
        title: 'Error',
        description: 'Invalid selection',
        variant: 'destructive',
      });
      return;
    }

    // Check for conflicts
    const hasConflict = appointments.some(apt => {
      const existingStart = new Date(apt.startTime);
      const existingEnd = new Date(apt.endTime);
      
      return apt.doctorId === bookingForm.doctorId &&
             apt.status !== 'CANCELLED' &&
             ((appointmentDateTime >= existingStart && appointmentDateTime < existingEnd) ||
              (endDateTime > existingStart && endDateTime <= existingEnd));
    });

    if (hasConflict) {
      toast({
        title: 'Booking Conflict',
        description: 'The doctor is not available at this time. Please choose another slot.',
        variant: 'destructive',
      });
      return;
    }

    // Create new appointment
    const newAppointment = {
      id: (appointments.length + 1).toString(),
      patientId: patient.id,
      doctorId: doctor.id,
      departmentId: department.id,
      startTime: appointmentDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      status: 'SCHEDULED' as const,
      reason: bookingForm.reason,
      patientName: patient.fullName,
      doctorName: doctor.fullName,
      departmentName: department.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments([...appointments, newAppointment]);
    setIsBookingOpen(false);
    setBookingForm({
      patientId: user?.role === 'PATIENT' ? user.patientId || '' : '',
      doctorId: '',
      departmentId: '',
      date: '',
      time: '',
      reason: '',
    });

    toast({
      title: 'Appointment Booked',
      description: `Your appointment with ${doctor.fullName} has been scheduled successfully.`,
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'CANCELLED' as const } : apt
    );
    setAppointments(updatedAppointments);
    
    toast({
      title: 'Appointment Cancelled',
      description: 'The appointment has been cancelled successfully.',
    });
  };

  const canBook = user?.role === 'PATIENT' || user?.role === 'ADMIN';
  const canCancel = (appointment: any) => {
    return user?.role === 'ADMIN' || 
           (user?.role === 'PATIENT' && appointment.patientId === mockPatients.find(p => p.userId === user.id)?.id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageInfo
          title="Appointments Management"
          description="This page allows you to view, schedule, and manage medical appointments. Patients can book new appointments and view their schedule, while doctors can see their daily appointments and admins can manage all appointments."
          example="Try booking a new appointment or use the search to find specific appointments by patient or doctor name."
        />

        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          {canBook && (
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                  <DialogDescription>
                    Schedule a new medical appointment.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  {user?.role !== 'PATIENT' && (
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient</Label>
                      <Select
                        value={bookingForm.patientId}
                        onValueChange={(value) => setBookingForm({ ...bookingForm, patientId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPatients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={bookingForm.departmentId}
                      onValueChange={(value) => {
                        setBookingForm({ ...bookingForm, departmentId: value, doctorId: '' });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDepartments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select
                      value={bookingForm.doctorId}
                      onValueChange={(value) => setBookingForm({ ...bookingForm, doctorId: value })}
                      disabled={!bookingForm.departmentId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors
                          .filter(doc => doc.departmentId === bookingForm.departmentId)
                          .map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.fullName} - {doctor.specialty}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe the reason for your visit..."
                      value={bookingForm.reason}
                      onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsBookingOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Book Appointment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments by patient, doctor, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No appointments found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'There are no appointments to display'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <Badge variant={
                          appointment.status === 'COMPLETED' ? 'default' :
                          appointment.status === 'SCHEDULED' ? 'secondary' : 'destructive'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Doctor:</span> {appointment.doctorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Department:</span> {appointment.departmentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(appointment.startTime), 'EEE, MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(appointment.startTime), 'HH:mm')} - 
                            {format(new Date(appointment.endTime), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {appointment.status === 'SCHEDULED' && canCancel(appointment) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;