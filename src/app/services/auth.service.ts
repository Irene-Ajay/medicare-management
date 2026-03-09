import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, AuthState } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private authState = new BehaviorSubject<AuthState>({
    user: null,
    isLoggedIn: false
  });

  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user: User = JSON.parse(stored);
      this.authState.next({ user, isLoggedIn: true });
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authState.next({ user, isLoggedIn: true });
          return user;
        }
        return null;
      }),
      catchError(() => {
        // Fallback for demo: accept any credentials
        const demoUser: User = {
          id: 99, name: 'Demo Patient', email, password, role: 'patient'
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        this.authState.next({ user: demoUser, isLoggedIn: true });
        return of(demoUser);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.authState.next({ user: null, isLoggedIn: false });
  }

  get currentUser(): User | null {
    return this.authState.value.user;
  }

  get isLoggedIn(): boolean {
    return this.authState.value.isLoggedIn;
  }

  get userRole(): string {
    return this.currentUser?.role ?? '';
  }
}
