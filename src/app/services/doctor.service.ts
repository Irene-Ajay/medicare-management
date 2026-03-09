import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  
  private apiUrl = 'https://medicare-api-ukhv.onrender.com/api/doctors';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  updateDoctor(id: number, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.apiUrl}/${id}`, data);
  }
}
