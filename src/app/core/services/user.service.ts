import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { User, RegisterRequest, AuthResponse } from '../models/user.model';
import { AuthService } from './auth.service';

interface StoredUser extends User {
  password: string;
}

const INITIAL_MOCK_USERS: StoredUser[] = [
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
export class UserService {
  private readonly usersSignal = signal<StoredUser[]>(INITIAL_MOCK_USERS);
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly users = this.usersSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  constructor(private authService: AuthService) {
    this.loadUsersFromStorage();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    const existingUser = this.usersSignal().find(
      u => u.email === request.emailOrPhone || u.phone === request.emailOrPhone
    );

    if (existingUser) {
      this.isLoadingSignal.set(false);
      return throwError(() => new Error('User with this email/phone already exists')).pipe(
        delay(800)
      );
    }

    const newUser: StoredUser = {
      id: this.generateUserId(),
      name: request.name,
      email: request.emailOrPhone.includes('@')
        ? request.emailOrPhone
        : '',
      phone: request.emailOrPhone.includes('@')
        ? undefined
        : request.emailOrPhone,
      password: request.password,
      createdAt: new Date(),
    };

    const updatedUsers = [...this.usersSignal(), newUser];
    this.usersSignal.set(updatedUsers);
    this.saveUsersToStorage(updatedUsers);

    const { password, ...userWithoutPassword } = newUser;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token: this.generateMockToken(),
    };

    return of(response).pipe(
      delay(800),
      tap(res => {
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        localStorage.setItem('auth_token', res.token);
        this.isLoadingSignal.set(false);
      })
    );
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.usersSignal().find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return of(userWithoutPassword).pipe(delay(200));
    }
    return of(undefined).pipe(delay(200));
  }

  getAllUsers(): Observable<User[]> {
    const users = this.usersSignal().map(({ password, ...user }) => user);
    return of(users).pipe(delay(300));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const users = this.usersSignal();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return throwError(() => new Error('User not found')).pipe(delay(500));
    }

    const updatedUser = { ...users[index], ...updates };
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;

    this.usersSignal.set(updatedUsers);
    this.saveUsersToStorage(updatedUsers);

    const { password, ...userWithoutPassword } = updatedUser;
    return of(userWithoutPassword).pipe(delay(500));
  }

  deleteUser(id: string): Observable<boolean> {
    const users = this.usersSignal().filter(u => u.id !== id);

    if (users.length === this.usersSignal().length) {
      return throwError(() => new Error('User not found')).pipe(delay(500));
    }

    this.usersSignal.set(users);
    this.saveUsersToStorage(users);

    return of(true).pipe(delay(500));
  }

  private generateUserId(): string {
    const users = this.usersSignal();
    const maxId = users.reduce((max, user) => {
      const numId = parseInt(user.id, 10);
      return isNaN(numId) ? max : Math.max(max, numId);
    }, 0);
    return (maxId + 1).toString();
  }

  private generateMockToken(): string {
    return (
      'mock_jwt_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private saveUsersToStorage(users: StoredUser[]): void {
    try {
      localStorage.setItem('mock_users', JSON.stringify(users));
    } catch {
      console.warn('Failed to save users to localStorage');
    }
  }

  private loadUsersFromStorage(): void {
    try {
      const usersJson = localStorage.getItem('mock_users');
      if (usersJson) {
        const users = JSON.parse(usersJson) as StoredUser[];
        this.usersSignal.set(users);
      }
    } catch {
      this.usersSignal.set(INITIAL_MOCK_USERS);
    }
  }
}
