import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="isLoggedIn"></app-navbar>
    <div [class.main-content]="isLoggedIn">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-content {
      margin-left: 260px;
      min-height: 100vh;
      background: #f0fdfa;
    }
    @media (max-width: 768px) {
      .main-content { margin-left: 0; }
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
    });
  }
}
