import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

const USERS_KEY = 'app_users';

interface StoredUser extends User {
  password: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    console.warn('Failed to save users to localStorage');
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    const users = loadUsers();
    const existing = users.find(
      u => u.email.toLowerCase() === request.emailOrPhone.toLowerCase()
    );

    if (existing && existing.blocked) {
      this.isLoadingSignal.set(false);
      return throwError(() => new Error('Your account has been blocked')).pipe(delay(800));
    }

    const isAdminEmail = request.emailOrPhone.toLowerCase() === 'admin@eldokan.com';
    let user: StoredUser;

    if (existing) {
      user = existing;
    } else {
      user = {
        id: `u_${Date.now()}`,
        name: request.emailOrPhone.split('@')[0],
        email: request.emailOrPhone,
        role: isAdminEmail ? 'admin' : 'user',
        blocked: false,
        password: request.password,
        createdAt: new Date(),
      };
      saveUsers([...users, user]);
    }

    const { password: _p, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token: this.generateMockToken(),
    };

    return of(response).pipe(
      delay(500),
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
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.currentUserSignal()).pipe(delay(200));
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

  getAllUsers(): User[] {
    return loadUsers().map(({ password: _p, ...u }) => u);
  }

  toggleBlockUser(userId: string): User | null {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx].blocked = !users[idx].blocked;
    saveUsers(users);
    const { password: _p, ...user } = users[idx];
    return user;
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): User | null {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx].role = role;
    saveUsers(users);
    const { password: _p, ...user } = users[idx];
    return user;
  }

  private generateMockToken(): string {
    return 'mock_jwt_' + Math.random().toString(36).substring(2, 15);
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
      const raw = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      if (raw && token) {
        const user = JSON.parse(raw) as User;
        this.currentUserSignal.set({
          ...user,
          role: user.role ?? 'user',
          blocked: user.blocked ?? false,
        });
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
