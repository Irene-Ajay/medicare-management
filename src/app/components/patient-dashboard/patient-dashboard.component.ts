import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';
import { MedicalRecord } from '../../models/patient.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatTabsModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatTableModule
  ],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  medicalRecords: MedicalRecord[] = [];
  loading = true;

  displayedColumns = ['doctor', 'date', 'reason', 'fee', 'status', 'actions'];
  historyColumns   = ['doctor', 'date', 'reason', 'fee', 'status'];

  constructor(
    private apptService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private notify: NotificationService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    forkJoin({
      appointments: this.apptService.getAppointments(),
      doctors:      this.doctorService.getDoctors(),
      records:      this.patientService.getMedicalRecords()
    }).subscribe({
      next: ({ appointments, doctors, records }) => {
        this.appointments = appointments;
        this.doctors = doctors;
        this.medicalRecords = records.filter(r => r.patientId === this.authService.currentUser?.id);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get upcoming(): Appointment[] {
    const patientName = this.authService.currentUser?.name;
    return this.appointments.filter(a => 
      (a.status === 'pending' || a.status === 'confirmed') && 
      a.patientName === patientName
    );
  }
  get history(): Appointment[] {
    const patientName = this.authService.currentUser?.name;
    return this.appointments.filter(a => 
      (a.status === 'completed' || a.status === 'cancelled') && 
      a.patientName === patientName
    );
  }
  get stats() {
    const patientName = this.authService.currentUser?.name;
    const patientAppointments = this.appointments.filter(a => a.patientName === patientName);
    return {
      upcoming:  this.upcoming.length,
      completed: this.history.filter(a => a.status === 'completed').length,
      spent: patientAppointments
        .filter(a => a.status === 'completed')
        .reduce((s, a) => s + a.fee, 0)
    };
  }

  getDoctor(id: number): Doctor | undefined { return this.doctors.find(d => d.id === id); }

  cancelAppointment(appt: Appointment): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { title: 'Cancel Appointment', message: 'Are you sure you want to cancel this appointment?' },
      panelClass: 'dark-dialog'
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed && appt.id != null) {
        this.apptService.updateStatus(appt.id, 'cancelled').subscribe(() => {
          appt.status = 'cancelled';
          this.notify.info('Appointment cancelled.');
        });
      }
    });
  }
}
