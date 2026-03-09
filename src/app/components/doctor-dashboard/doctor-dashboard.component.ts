import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  doctor: Doctor | null = null;
  loading = true;

  constructor(
    private apptService: AppointmentService,
    private doctorService: DoctorService,
    private notify: NotificationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    forkJoin({
      appointments: this.apptService.getAppointments(),
      doctors:      this.doctorService.getDoctors()
    }).subscribe({
      next: ({ appointments, doctors }) => {
        this.appointments = appointments;
        // Simulate logged-in doctor = first doctor
        this.doctor = doctors[0];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get pending():   Appointment[] { return this.appointments.filter(a => a.status === 'pending'); }
  get confirmed(): Appointment[] { return this.appointments.filter(a => a.status === 'confirmed'); }
  get all():       Appointment[] { return this.appointments; }

  get stats() {
    return {
      pending:   this.pending.length,
      confirmed: this.confirmed.length,
      total:     this.all.length,
      revenue:   this.confirmed.reduce((s, a) => s + a.fee, 0)
    };
  }

  approve(appt: Appointment): void {
    if (appt.id == null) return;
    this.apptService.updateStatus(appt.id, 'confirmed').subscribe(() => {
      appt.status = 'confirmed';
      this.notify.success(`Appointment confirmed for ${appt.patientName}`);
    });
  }

  reject(appt: Appointment): void {
    if (appt.id == null) return;
    this.apptService.updateStatus(appt.id, 'cancelled').subscribe(() => {
      appt.status = 'cancelled';
      this.notify.info(`Appointment cancelled for ${appt.patientName}`);
    });
  }

  complete(appt: Appointment): void {
    if (appt.id == null) return;
    this.apptService.updateStatus(appt.id, 'completed').subscribe(() => {
      appt.status = 'completed';
      this.notify.success(`Marked as completed`);
    });
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
}
