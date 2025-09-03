import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/Layout/MainLayout';
import PageInfo from '@/components/Common/PageInfo';
import { useAuth } from '@/context/AuthContext';
import { User, Save, Edit } from 'lucide-react';
import { mockPatients, mockDoctors } from '@/lib/mockData';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user) {
      let data = null;
      if (user.role === 'PATIENT') {
        data = mockPatients.find(p => p.userId === user.id);
      } else if (user.role === 'DOCTOR') {
        data = mockDoctors.find(d => d.userId === user.id);
      } else {
        data = { ...user }; // Admin user
      }
      
      setProfileData(data);
      setFormData(data || {});
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProfileData({ ...profileData, ...formData });
    setIsEditing(false);
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleCancel = () => {
    setFormData(profileData || {});
    setIsEditing(false);
  };

  if (!profileData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageInfo
          title="Profile Management"
          description="This page allows you to view and update your personal information. Keep your profile up-to-date to ensure accurate records and better communication."
          example="Click 'Edit Profile' to update your information, or view your current details below."
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Header */}
          <Card className="lg:col-span-3 bg-gradient-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {profileData.fullName?.charAt(0) || user?.fullName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {profileData.fullName || user?.fullName}
                  </h2>
                  <p className="text-primary-foreground/80 capitalize">
                    {user?.role?.toLowerCase()}
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    {profileData.email || user?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || user?.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                {user?.role === 'PATIENT' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob || ''}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input
                          id="bloodGroup"
                          value={formData.bloodGroup || ''}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </>
                )}

                {user?.role === 'DOCTOR' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={formData.specialty || ''}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shiftStartTime">Shift Start Time</Label>
                        <Input
                          id="shiftStartTime"
                          type="time"
                          value={formData.shiftStartTime || ''}
                          onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shiftEndTime">Shift End Time</Label>
                        <Input
                          id="shiftEndTime"
                          type="time"
                          value={formData.shiftEndTime || ''}
                          onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </>
                )}

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <Badge variant="outline">{user?.id}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="secondary" className="capitalize">
                    {user?.role?.toLowerCase()}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default">Active</Badge>
                </div>

                {user?.role === 'PATIENT' && user?.patientId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Patient ID</span>
                    <Badge variant="outline">{user.patientId}</Badge>
                  </div>
                )}

                {user?.role === 'DOCTOR' && user?.doctorId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Doctor ID</span>
                    <Badge variant="outline">{user.doctorId}</Badge>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Security</h4>
                <Button variant="outline" size="sm" className="w-full">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information for Patients */}
        {user?.role === 'PATIENT' && profileData.medicalHistory && (
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.medicalHistory || ''}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="Enter medical history..."
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">
                  {profileData.medicalHistory || 'No medical history recorded'}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;