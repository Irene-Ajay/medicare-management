import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}?doctorId=${doctorId}`);
  }

  getAppointmentsByPatient(name: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}?patientName=${name}`);
  }

  createAppointment(appt: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appt);
  }

  updateStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}`, { status });
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
