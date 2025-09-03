import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  isActive: boolean;
  // Role-specific data
  patientId?: string;
  doctorId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerPatient: (data: RegisterPatientData) => Promise<boolean>;
  isLoading: boolean;
}

interface RegisterPatientData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@hams.test',
    password: 'Admin@123',
    fullName: 'System Administrator',
    role: 'ADMIN',
    phone: '+1-555-0001',
    isActive: true,
  },
  {
    id: '2',
    email: 'drsmith@hams.test',
    password: 'Doctor@123',
    fullName: 'Dr. Sarah Smith',
    role: 'DOCTOR',
    phone: '+1-555-0002',
    isActive: true,
    doctorId: '1',
  },
  {
    id: '3',
    email: 'john@hams.test',
    password: 'Patient@123',
    fullName: 'John Doe',
    role: 'PATIENT',
    phone: '+1-555-0003',
    isActive: true,
    patientId: '1',
  },
  {
    id: '4',
    email: 'drjohnson@hams.test',
    password: 'Doctor@123',
    fullName: 'Dr. Michael Johnson',
    role: 'DOCTOR',
    phone: '+1-555-0004',
    isActive: true,
    doctorId: '2',
  },
  {
    id: '5',
    email: 'jane@hams.test',
    password: 'Patient@123',
    fullName: 'Jane Smith',
    role: 'PATIENT',
    phone: '+1-555-0005',
    isActive: true,
    patientId: '2',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('hams_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('hams_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser && foundUser.isActive) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('hams_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hams_user');
  };

  const registerPatient = async (data: RegisterPatientData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    // Create new patient user
    const newUser: User & { password: string } = {
      id: (mockUsers.length + 1).toString(),
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: 'PATIENT',
      phone: data.phone,
      isActive: true,
      patientId: (mockUsers.filter(u => u.role === 'PATIENT').length + 1).toString(),
    };

    mockUsers.push(newUser);
    
    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('hams_user', JSON.stringify(userWithoutPassword));
    
    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      registerPatient,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};