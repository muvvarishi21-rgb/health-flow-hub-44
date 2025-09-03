// Mock data for HAMS system

export interface Department {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  userId: string;
  departmentId: string;
  specialty: string;
  bio: string;
  shiftStartTime: string;
  shiftEndTime: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup: string;
  medicalHistory: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  reason: string;
  patientName: string;
  doctorName: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  notes: string;
  diagnosis: string;
  prescriptions: string;
  patientName: string;
  doctorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  status: 'UNPAID' | 'PAID' | 'PARTIAL';
  issuedAt: string;
  dueAt: string;
  patientName: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system care',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Neurology',
    description: 'Brain and nervous system disorders',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Orthopedics',
    description: 'Bone, joint, and muscle treatment',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Pediatrics',
    description: 'Medical care for infants, children, and adolescents',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'General Medicine',
    description: 'Primary healthcare and general medical conditions',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Radiology',
    description: 'Medical imaging and diagnostic procedures',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    userId: '2',
    departmentId: '1',
    specialty: 'Interventional Cardiology',
    bio: 'Dr. Sarah Smith is a leading cardiologist with over 15 years of experience.',
    shiftStartTime: '08:00',
    shiftEndTime: '16:00',
    fullName: 'Dr. Sarah Smith',
    phone: '+1-555-0002',
    email: 'drsmith@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    userId: '4',
    departmentId: '2',
    specialty: 'Neurological Surgery',
    bio: 'Dr. Michael Johnson specializes in complex brain surgeries.',
    shiftStartTime: '07:00',
    shiftEndTime: '15:00',
    fullName: 'Dr. Michael Johnson',
    phone: '+1-555-0004',
    email: 'drjohnson@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    userId: '6',
    departmentId: '3',
    specialty: 'Sports Medicine',
    bio: 'Dr. Emily Davis focuses on sports-related injuries and rehabilitation.',
    shiftStartTime: '09:00',
    shiftEndTime: '17:00',
    fullName: 'Dr. Emily Davis',
    phone: '+1-555-0006',
    email: 'drdavis@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    userId: '7',
    departmentId: '4',
    specialty: 'Pediatric Emergency Medicine',
    bio: 'Dr. Robert Wilson provides emergency care for children.',
    shiftStartTime: '12:00',
    shiftEndTime: '20:00',
    fullName: 'Dr. Robert Wilson',
    phone: '+1-555-0007',
    email: 'drwilson@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    userId: '8',
    departmentId: '5',
    specialty: 'Internal Medicine',
    bio: 'Dr. Lisa Anderson provides comprehensive adult medical care.',
    shiftStartTime: '08:30',
    shiftEndTime: '16:30',
    fullName: 'Dr. Lisa Anderson',
    phone: '+1-555-0008',
    email: 'dranderson@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: '1',
    userId: '3',
    dob: '1985-03-15',
    gender: 'Male',
    address: '123 Main St, Springfield, IL 62701',
    bloodGroup: 'O+',
    medicalHistory: 'Hypertension, controlled with medication',
    fullName: 'John Doe',
    phone: '+1-555-0003',
    email: 'john@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    userId: '5',
    dob: '1990-07-22',
    gender: 'Female',
    address: '456 Oak Ave, Springfield, IL 62702',
    bloodGroup: 'A+',
    medicalHistory: 'Allergies to penicillin',
    fullName: 'Jane Smith',
    phone: '+1-555-0005',
    email: 'jane@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Add more patients...
  {
    id: '3',
    userId: '9',
    dob: '1975-12-10',
    gender: 'Male',
    address: '789 Pine St, Springfield, IL 62703',
    bloodGroup: 'B+',
    medicalHistory: 'Diabetes Type 2, managed with diet and medication',
    fullName: 'Robert Brown',
    phone: '+1-555-0009',
    email: 'robert@hams.test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Generate appointments for the next 30 days
const generateAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const today = new Date();
  
  for (let i = -7; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip weekends for some appointments
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate 2-5 appointments per day
    const numAppointments = Math.floor(Math.random() * 4) + 2;
    
    for (let j = 0; j < numAppointments; j++) {
      const hour = 9 + j * 2; // Appointments every 2 hours starting at 9 AM
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      const doctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
      const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
      const department = mockDepartments.find(d => d.id === doctor.departmentId)!;
      
      const statuses: Appointment['status'][] = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];
      const status = i < 0 ? 'COMPLETED' : statuses[Math.floor(Math.random() * statuses.length)];
      
      appointments.push({
        id: `${appointments.length + 1}`,
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: doctor.departmentId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status,
        reason: ['Regular checkup', 'Follow-up visit', 'Consultation', 'Emergency visit'][Math.floor(Math.random() * 4)],
        patientName: patient.fullName,
        doctorName: doctor.fullName,
        departmentName: department.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  
  return appointments;
};

export const mockAppointments = generateAppointments();

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    visitDate: '2024-01-15',
    notes: 'Patient presented with chest pain. ECG normal. Prescribed medication for anxiety.',
    diagnosis: 'Anxiety-related chest pain',
    prescriptions: 'Lorazepam 0.5mg as needed for anxiety',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    visitDate: '2024-01-20',
    notes: 'Routine neurological examination. All reflexes normal.',
    diagnosis: 'Normal neurological function',
    prescriptions: 'Continue current medications',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Michael Johnson',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

// Mock Invoices with Items
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    patientId: '1',
    appointmentId: '1',
    amount: 250.00,
    status: 'PAID',
    issuedAt: '2024-01-15T00:00:00Z',
    dueAt: '2024-02-15T00:00:00Z',
    patientName: 'John Doe',
    items: [
      {
        id: '1',
        invoiceId: '1',
        description: 'Consultation Fee',
        quantity: 1,
        unitPrice: 150.00,
      },
      {
        id: '2',
        invoiceId: '1',
        description: 'ECG Test',
        quantity: 1,
        unitPrice: 100.00,
      },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    patientId: '2',
    appointmentId: '2',
    amount: 180.00,
    status: 'UNPAID',
    issuedAt: '2024-01-20T00:00:00Z',
    dueAt: '2024-02-20T00:00:00Z',
    patientName: 'Jane Smith',
    items: [
      {
        id: '3',
        invoiceId: '2',
        description: 'Neurological Consultation',
        quantity: 1,
        unitPrice: 180.00,
      },
    ],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

// Helper functions for mock API operations
export const mockApi = {
  // Simulate API delay
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate ID for new records
  generateId: () => Date.now().toString(),
  
  // Get current date/time
  now: () => new Date().toISOString(),
};