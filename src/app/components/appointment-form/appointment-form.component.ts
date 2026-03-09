import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../services/notification.service';
import { Doctor } from '../../models/doctor.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  form!: FormGroup;
  doctor: Doctor | null = null;
  doctors: Doctor[] = [];
  loading = false;
  today = new Date().toISOString().split('T')[0];
  isDialog = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private apptService: AppointmentService,
    private notify: NotificationService,
    private authService: AuthService,
    @Optional() private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: { doctor: Doctor }
  ) {
    this.isDialog = !!dialogRef;
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.dialogData?.doctor) {
      this.doctor = this.dialogData.doctor;
      this.form.patchValue({ doctorId: this.doctor.id });
    } else {
      this.doctorService.getDoctors().subscribe(docs => {
        this.doctors = docs.filter(d => d.available);
        if (this.doctors.length) {
          this.form.patchValue({ doctorId: this.doctors[0].id });
          this.doctor = this.doctors[0];
        }
      });
    }
    const user = this.authService.currentUser;
    if (user) {
      this.form.patchValue({ patientName: user.name, email: user.email });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      doctorId:    [null, Validators.required],
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      email:       ['', [Validators.required, Validators.email]],
      phone:       ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      date:        ['', Validators.required],
      time:        ['', Validators.required],
      reason:      ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onDoctorChange(id: number): void {
    this.doctor = this.doctors.find(d => d.id === Number(id)) ?? null;
    this.form.patchValue({ time: '' });
  }

  get selectedSlots(): string[] {
    return this.doctor?.slots ?? [];
  }

  

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const appt = { ...this.form.value, status: 'pending', fee: this.doctor?.fee ?? 0 };
    this.apptService.createAppointment(appt).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Appointment booked successfully!');
        if (this.dialogRef) this.dialogRef.close(true);
        else this.form.reset();
      },
      error: () => {
        this.loading = false;
        this.notify.error('Failed to book appointment. Please try again.');
      }
    });
  }

  close(): void { this.dialogRef?.close(); }
  f(name: string) { return this.form.get(name); }
}
