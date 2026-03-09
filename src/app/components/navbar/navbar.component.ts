import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  currentRoute = '';

  navItems = [
    { path: '/home',             icon: 'home',             label: 'Home',          roles: ['patient', 'admin'] },
    { path: '/doctors',          icon: 'medical_services', label: 'Find Doctors',  roles: ['patient', 'admin'] },
    { path: '/appointments',     icon: 'event',            label: 'Appointments',  roles: ['patient', 'admin'] },
    { path: '/dashboard',        icon: 'dashboard',        label: 'My Dashboard',  roles: ['patient'] },
    { path: '/doctor-dashboard', icon: 'local_hospital',   label: 'Dashboard',     roles: ['doctor'] },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.user = state.user;
    });
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  get visibleNav() {
    return this.navItems.filter(item => item.roles.includes(this.user?.role ?? ''));
  }

  get userInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
