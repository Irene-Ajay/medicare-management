export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  address?: string;
  bloodGroup?: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  date: string;
  doctor: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}
