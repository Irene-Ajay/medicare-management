export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  fee: number;
  available: boolean;
  slots: string[];
  experience: string;
  hospital: string;
  initials: string;
  phone?: string;
  email?: string;
}
