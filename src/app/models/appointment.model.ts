export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id?: number;
  doctorId: number;
  patientName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  fee: number;
}
