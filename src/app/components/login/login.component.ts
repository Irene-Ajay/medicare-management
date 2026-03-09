import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  selectedRole: 'patient' | 'doctor' | 'admin' = 'patient';
  errorMessage = '';
  roles: ('patient' | 'doctor' | 'admin')[] = ['patient', 'doctor', 'admin'];

  demoCredentials = {
    patient: { email: 'john@example.com', password: 'patient123' },
    doctor:  { email: 'dr.chen@hospital.com', password: 'doctor123' },
    admin:   { email: 'admin@hospital.com', password: 'admin123' }
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  selectRole(role: 'patient' | 'doctor' | 'admin'): void {
    this.selectedRole = role;
    const creds = this.demoCredentials[role];
    this.loginForm.patchValue(creds);
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) {
          this.notify.success(`Welcome back, ${user.name}!`);
          if (user.role === 'doctor') {
            this.router.navigate(['/doctor-dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }

  get emailCtrl() { return this.loginForm.get('email'); }
  get passwordCtrl() { return this.loginForm.get('password'); }
}
