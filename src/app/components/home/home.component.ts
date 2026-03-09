import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  loading = true;

  stats = { total: 0, confirmed: 0, pending: 0, completed: 0 };

  constructor(
    private apptService: AppointmentService,
    private doctorService: DoctorService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    forkJoin({
      appointments: this.apptService.getAppointments(),
      doctors: this.doctorService.getDoctors()
    }).subscribe({
      next: ({ appointments, doctors }) => {
        this.appointments = appointments;
        this.doctors = doctors;
        this.calcStats();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  calcStats(): void {
    this.stats = {
      total:     this.appointments.length,
      confirmed: this.appointments.filter(a => a.status === 'confirmed').length,
      pending:   this.appointments.filter(a => a.status === 'pending').length,
      completed: this.appointments.filter(a => a.status === 'completed').length
    };
  }

  get nextAppointment(): Appointment | null {
    return this.appointments.find(a => a.status === 'pending' || a.status === 'confirmed') ?? null;
  }

  get topDoctors(): Doctor[] {
    return this.doctors.filter(d => d.available).slice(0, 4);
  }

  getDoctorName(id: number): string {
    return this.doctors.find(d => d.id === id)?.name ?? '—';
  }

  getDoctorSpec(id: number): string {
    return this.doctors.find(d => d.id === id)?.specialization ?? '';
  }

  get recentAppointments(): Appointment[] {
    return this.appointments.slice(0, 5);
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }
}
