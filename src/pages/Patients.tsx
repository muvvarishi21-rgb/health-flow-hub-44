import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/Layout/MainLayout';
import PageInfo from '@/components/Common/PageInfo';
import { useAuth } from '@/context/AuthContext';
import { Users, Plus, Search, Eye, Edit, UserPlus } from 'lucide-react';
import { mockPatients } from '@/lib/mockData';
import { format } from 'date-fns';

const Patients: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [patients, setPatients] = useState(mockPatients);
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    bloodGroup: '',
    medicalHistory: '',
  });

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const filtered = patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [patients, searchTerm]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientForm.fullName || !patientForm.email || !patientForm.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Check if email already exists
    const emailExists = patients.some(p => p.email === patientForm.email);
    if (emailExists) {
      toast({
        title: 'Error',
        description: 'A patient with this email already exists',
        variant: 'destructive',
      });
      return;
    }

    const newPatient = {
      id: (patients.length + 1).toString(),
      userId: (patients.length + 10).toString(), // Mock user ID
      ...patientForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPatients([...patients, newPatient]);
    setIsAddingPatient(false);
    setPatientForm({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'Male',
      address: '',
      bloodGroup: '',
      medicalHistory: '',
    });

    toast({
      title: 'Patient Added',
      description: `${patientForm.fullName} has been registered successfully.`,
    });
  };

  const canManagePatients = user?.role === 'ADMIN';
  const canViewPatients = user?.role === 'ADMIN' || user?.role === 'DOCTOR';

  if (!canViewPatients) {
    return (
      <MainLayout>
        <PageInfo
          title="Access Denied"
          description="You don't have permission to view patient records."
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageInfo
          title="Patient Management"
          description="This page allows healthcare providers to manage patient records. Doctors can view patient information to provide better care, while administrators can add, edit, and manage all patient records in the system."
          example="Try searching for a patient by name or blood group, or click 'Add Patient' to register a new patient."
        />

        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          {canManagePatients && (
            <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>
                    Register a new patient in the system.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={patientForm.fullName}
                        onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        placeholder="+1-555-0000"
                        value={patientForm.phone}
                        onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={patientForm.dob}
                        onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        placeholder="A+"
                        value={patientForm.bloodGroup}
                        onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, State"
                      value={patientForm.address}
                      onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Input
                      id="medicalHistory"
                      placeholder="Any relevant medical history..."
                      value={patientForm.medicalHistory}
                      onChange={(e) => setPatientForm({ ...patientForm, medicalHistory: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingPatient(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Patient
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, email, phone, or blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No patients found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search term' : 'No patients are registered yet'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{patient.fullName}</CardTitle>
                    <Badge variant="outline">ID: {patient.id}</Badge>
                  </div>
                  <CardDescription>Patient Profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blood Group:</span>
                      <Badge variant="secondary">{patient.bloodGroup}</Badge>
                    </div>
                    {patient.dob && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span>{new Date().getFullYear() - new Date(patient.dob).getFullYear()} years</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span>{patient.gender}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setViewingPatient(patient)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {canManagePatients && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Patient Details Dialog */}
        {viewingPatient && (
          <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{viewingPatient.fullName}</DialogTitle>
                <DialogDescription>Patient Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Patient ID:</span>
                    <p>{viewingPatient.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Blood Group:</span>
                    <p>{viewingPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p>{viewingPatient.dob ? format(new Date(viewingPatient.dob), 'MMM dd, yyyy') : 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span>
                    <p>{viewingPatient.gender}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="font-medium text-sm">Contact Information:</span>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Email: {viewingPatient.email}</p>
                    <p>Phone: {viewingPatient.phone}</p>
                    <p>Address: {viewingPatient.address || 'Not provided'}</p>
                  </div>
                </div>

                {viewingPatient.medicalHistory && (
                  <div className="space-y-2">
                    <span className="font-medium text-sm">Medical History:</span>
                    <p className="text-sm text-muted-foreground">{viewingPatient.medicalHistory}</p>
                  </div>
                )}
                
                <Button onClick={() => setViewingPatient(null)} className="w-full">
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default Patients;