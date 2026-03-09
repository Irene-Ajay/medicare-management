import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, MedicalRecord } from '../models/patient.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  getMedicalRecords(patientId?: number): Observable<MedicalRecord[]> {
    const url = patientId
      ? `${this.apiUrl}/medicalRecords?patientId=${patientId}`
      : `${this.apiUrl}/medicalRecords`;
    return this.http.get<MedicalRecord[]>(url);
  }
}
