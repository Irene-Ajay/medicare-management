import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="page-container" *ngIf="doctor">
      <a routerLink="/doctors" style="color:var(--teal);font-size:14px;text-decoration:none;display:flex;align-items:center;gap:4px;margin-bottom:20px;">
        <mat-icon style="font-size:16px;height:16px;width:16px;">arrow_back</mat-icon> Back to Doctors
      </a>
      <div class="app-card">
        <div class="doc-header">
          <div class="big-avatar">{{ doctor.initials }}</div>
          <div>
            <h2 style="font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:var(--white);">{{ doctor.name }}</h2>
            <p style="color:var(--teal2);margin-top:4px;">{{ doctor.specialization }}</p>
            <p style="color:var(--muted);font-size:13px;margin-top:4px;">{{ doctor.hospital }}</p>
            <div style="display:flex;gap:16px;margin-top:12px;">
              <span style="font-size:13px;color:#fbbf24;">★ {{ doctor.rating }}</span>
              <span style="font-size:13px;color:var(--muted);">{{ doctor.experience }} experience</span>
              <span style="font-size:13px;color:var(--teal2);">{{ doctor.fee | currency }} / visit</span>
            </div>
          </div>
          <button mat-raised-button class="btn-teal" style="margin-left:auto;" (click)="book()" [disabled]="!doctor.available">
            <mat-icon>event_available</mat-icon>
            {{ doctor.available ? 'Book Appointment' : 'Unavailable' }}
          </button>
        </div>
        <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
          <h3 style="font-family:'Syne',sans-serif;font-weight:700;color:var(--white);margin-bottom:12px;">Available Slots</h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <span *ngFor="let s of doctor.slots" style="background:var(--glass2);border:1px solid var(--border);border-radius:8px;padding:8px 16px;font-size:13px;color:var(--text);">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.doc-header{display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap;}
  .big-avatar{width:80px;height:80px;border-radius:18px;background:rgba(14,165,233,0.15);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:var(--teal2);flex-shrink:0;}`]
})
export class DoctorDetailComponent implements OnInit {
  doctor: Doctor | null = null;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctorService.getDoctorById(id).subscribe(d => this.doctor = d);
  }

  book(): void {
    if (!this.doctor) return;
    this.dialog.open(AppointmentFormComponent, {
      width: '560px', maxHeight: '90vh',
      data: { doctor: this.doctor }, panelClass: 'dark-dialog'
    });
  }
}
