import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-wrapper">
      <div class="confirm-header">
        <h2 class="confirm-title">{{ data.title }}</h2>
        <button class="close-btn" (click)="dialogRef.close(false)">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <p class="confirm-msg">{{ data.message }}</p>
      <div class="confirm-actions">
        <button mat-stroked-button class="btn-outline" (click)="dialogRef.close(false)">Cancel</button>
        <button mat-raised-button class="btn-danger" (click)="dialogRef.close(true)">Confirm</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-wrapper { padding: 24px; background: #ffffff; }
    .confirm-header  { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
    .confirm-title   { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#0f172a; }
    .close-btn       { background:#f8fafc; border:1px solid rgba(13,148,136,0.15); border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; width:32px; height:32px; color:#64748b; }
    .close-btn mat-icon { font-size:16px; height:16px; width:16px; }
    .confirm-msg     { font-size:14px; color:#64748b; margin-bottom:20px; line-height:1.5; }
    .confirm-actions { display:flex; gap:10px; justify-content:flex-end; }
    .btn-outline { background:white!important; border:1px solid rgba(13,148,136,0.2)!important; color:#1e293b!important; border-radius:8px!important; }
    .btn-danger  { background:#fef2f2!important; border:1px solid rgba(239,68,68,0.25)!important; color:#ef4444!important; border-radius:8px!important; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}
