import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'password123',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    password: 'password456',
    createdAt: new Date('2024-02-15'),
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    const user = MOCK_USERS.find(
      u =>
        (u.email === request.emailOrPhone ||
          u.phone === request.emailOrPhone) &&
        u.password === request.password
    );

    if (!user) {
      this.isLoadingSignal.set(false);
      return throwError(() => new Error('Invalid email/phone or password')).pipe(
        delay(800)
      );
    }

    const { password, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token: this.generateMockToken(),
    };

    return of(response).pipe(
      delay(800),
      tap(res => {
        this.currentUserSignal.set(res.user);
        this.tokenSignal.set(res.token);
        this.saveToStorage(res.user, res.token);
        this.isLoadingSignal.set(false);
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.clearStorage();
    this.router.navigate(['/']);
  }

  getCurrentUser(): Observable<User | null> {
    const user = this.currentUserSignal();
    return of(user).pipe(delay(200));
  }

  updateCurrentUser(updates: Partial<User>): Observable<User> {
    const current = this.currentUserSignal();
    if (!current) {
      return throwError(() => new Error('No user logged in'));
    }

    const updatedUser = { ...current, ...updates };
    this.currentUserSignal.set(updatedUser);
    this.saveToStorage(updatedUser, this.tokenSignal()!);

    return of(updatedUser).pipe(delay(500));
  }

  private generateMockToken(): string {
    return (
      'mock_jwt_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private saveToStorage(user: User, token: string): void {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
    } catch {
      console.warn('Failed to save auth state to localStorage');
    }
  }

  private loadFromStorage(): void {
    try {
      const userJson = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');

      if (userJson && token) {
        const user = JSON.parse(userJson) as User;
        this.currentUserSignal.set(user);
        this.tokenSignal.set(token);
      }
    } catch {
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    } catch {
      console.warn('Failed to clear auth state from localStorage');
    }
  }
}
