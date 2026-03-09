import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('./components/doctor-list/doctor-list.component').then(m => m.DoctorListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'doctors/:id',
    loadComponent: () =>
      import('./components/doctor-list/doctor-detail.component').then(m => m.DoctorDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./components/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/patient-dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'doctor-dashboard',
    loadComponent: () =>
      import('./components/doctor-dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
