import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="min-h-[calc(100vh-200px)] flex">
      <div class="hidden lg:block lg:w-1/2 bg-[#CBE4E8] relative overflow-hidden">
        <img
          src="images/auth/shopping-cart-phone.svg"
          alt="Shopping cart with phone"
          class="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-[370px]">
          <h1 class="text-[32px] font-medium tracking-tight mb-2">Create an account</h1>
          <p class="text-base mb-10">Enter your details below</p>

          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                placeholder="Name"
                class="w-full pb-3 border-b border-gray-400 text-base outline-none focus:border-black transition-colors placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <input
                type="text"
                [(ngModel)]="emailOrPhone"
                name="emailOrPhone"
                placeholder="Email or Phone Number"
                class="w-full pb-3 border-b border-gray-400 text-base outline-none focus:border-black transition-colors placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Password"
                class="w-full pb-3 border-b border-gray-400 text-base outline-none focus:border-black transition-colors placeholder:text-gray-500"
                required
              />
            </div>

            @if (errorMessage()) {
              <p class="text-[#DB4444] text-sm">{{ errorMessage() }}</p>
            }

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full bg-[#DB4444] text-white py-3 rounded text-base font-medium hover:bg-[#c53a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (isLoading()) {
                  <span>Creating Account...</span>
                } @else {
                  <span>Create Account</span>
                }
              </button>
            </div>

            <div class="pt-2">
              <button
                type="button"
                class="w-full border border-gray-300 py-3 rounded text-base font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>
          </form>

          <div class="mt-10 text-center">
            <p class="text-gray-600">
              Already have account?
              <a routerLink="/login" class="text-black font-medium ml-1 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SignupComponent {
  name = '';
  emailOrPhone = '';
  password = '';

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name || !this.emailOrPhone || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService
      .register({
        name: this.name,
        emailOrPhone: this.emailOrPhone,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message);
        },
      });
  }
}
