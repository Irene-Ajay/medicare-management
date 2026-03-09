import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SlicePipe } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { FilterDoctorsPipe } from '../../pipes/filter-doctors.pipe';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatDialogModule,
    MatChipsModule, MatTooltipModule, MatSelectModule, MatFormFieldModule, FilterDoctorsPipe, SlicePipe
  ],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = true;
  searchTerm = '';
  selectedSpec = 'All';

  specializations = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics', 'Oncology'];

  specColors: Record<string, string> = {
    Cardiology:   '#ef4444',
    Neurology:    '#8b5cf6',
    Orthopedics:  '#f59e0b',
    Dermatology:  '#10b981',
    Pediatrics:   '#3b82f6',
    Oncology:     '#ec4899'
  };

  constructor(private doctorService: DoctorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => { this.doctors = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getSpecColor(spec: string): string {
    return this.specColors[spec] ?? '#0ea5e9';
  }

  bookAppointment(doctor: Doctor): void {
    this.dialog.open(AppointmentFormComponent, {
      width: '560px',
      maxHeight: '90vh',
      data: { doctor },
      panelClass: 'dark-dialog'
    });
  }

  get filteredCount(): number {
    const pipe = new FilterDoctorsPipe();
    return pipe.transform(this.doctors, this.selectedSpec, this.searchTerm).length;
  }
}
