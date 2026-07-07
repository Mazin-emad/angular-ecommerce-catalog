import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { User, RegisterRequest, AuthResponse } from '../models/user.model';
import { AuthService } from './auth.service';

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
export class UserService {
  private readonly usersSignal = signal<StoredUser[]>(loadUsers());
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly users = this.usersSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  constructor(private authService: AuthService) {
    window.addEventListener('storage', () => {
      this.usersSignal.set(loadUsers());
    });
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    const users = loadUsers();
    const existingUser = users.find(
      u => u.email === request.emailOrPhone || u.phone === request.emailOrPhone
    );

    if (existingUser) {
      this.isLoadingSignal.set(false);
      return throwError(() => new Error('User with this email/phone already exists')).pipe(delay(800));
    }

    const isAdminEmail = request.emailOrPhone.toLowerCase() === 'admin@eldokan.com';
    const newUser: StoredUser = {
      id: `u_${Date.now()}`,
      name: request.name,
      email: request.emailOrPhone.includes('@') ? request.emailOrPhone : '',
      phone: request.emailOrPhone.includes('@') ? undefined : request.emailOrPhone,
      role: isAdminEmail ? 'admin' : 'user',
      blocked: false,
      password: request.password,
      createdAt: new Date(),
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    this.usersSignal.set(updatedUsers);

    const { password: _p, ...userWithoutPassword } = newUser;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token: 'mock_jwt_' + Math.random().toString(36).substring(2, 15),
    };

    return of(response).pipe(
      delay(500),
      tap(res => {
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        localStorage.setItem('auth_token', res.token);
        this.isLoadingSignal.set(false);
      })
    );
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = loadUsers().find(u => u.id === id);
    if (user) {
      const { password: _p, ...u } = user;
      return of(u).pipe(delay(200));
    }
    return of(undefined).pipe(delay(200));
  }

  getAllUsers(): Observable<User[]> {
    const users = loadUsers().map(({ password: _p, ...u }) => u);
    return of(users).pipe(delay(300));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return throwError(() => new Error('User not found')).pipe(delay(500));
    }

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    saveUsers(users);
    this.usersSignal.set(users);

    const { password: _p, ...u } = updatedUser;
    return of(u).pipe(delay(500));
  }

  deleteUser(id: string): Observable<boolean> {
    const users = loadUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) {
      return throwError(() => new Error('User not found')).pipe(delay(500));
    }
    saveUsers(filtered);
    this.usersSignal.set(filtered);
    return of(true).pipe(delay(500));
  }
}
