import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <h1 class="text-[32px] font-medium tracking-tight mb-2">Log in to Exclusive</h1>
          <p class="text-base mb-10">Enter your details below</p>

          <form (ngSubmit)="onSubmit()" class="space-y-6">
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

            <div class="flex items-center justify-between pt-2">
              <button
                type="submit"
                [disabled]="isLoading()"
                class="bg-[#DB4444] text-white px-12 py-3 rounded text-base font-medium hover:bg-[#c53a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (isLoading()) {
                  <span>Logging in...</span>
                } @else {
                  <span>Log In</span>
                }
              </button>

              <a routerLink="/forgot-password" class="text-[#DB4444] text-base hover:underline">
                Forget Password?
              </a>
            </div>
          </form>

          <div class="mt-16 text-center">
            <p class="text-gray-600">
              Don't have account?
              <a routerLink="/signup" class="text-black font-medium ml-1 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent {
  emailOrPhone = '';
  password = '';

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.emailOrPhone || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .login({
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
