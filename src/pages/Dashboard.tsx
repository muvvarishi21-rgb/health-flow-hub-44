import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import DoctorDashboard from '@/components/Dashboard/DoctorDashboard';
import PatientDashboard from '@/components/Dashboard/PatientDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'DOCTOR':
        return <DoctorDashboard />;
      case 'PATIENT':
        return <PatientDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <MainLayout>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Dashboard;