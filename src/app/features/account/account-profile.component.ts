import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="border border-gray-200 rounded-lg p-6 sm:p-10">
      <h2 class="text-[#DB4444] text-lg font-medium mb-8">Edit Your Profile</h2>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- First Name / Last Name -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              formControlName="firstName"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (profileForm.controls.firstName.invalid && profileForm.controls.firstName.touched) {
              <p class="text-red-500 text-xs mt-1">First name is required.</p>
            }
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              formControlName="lastName"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (profileForm.controls.lastName.invalid && profileForm.controls.lastName.touched) {
              <p class="text-red-500 text-xs mt-1">Last name is required.</p>
            }
          </div>
        </div>

        <!-- Email / Address -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (profileForm.controls.email.invalid && profileForm.controls.email.touched) {
              <p class="text-red-500 text-xs mt-1">Valid email is required.</p>
            }
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              formControlName="address"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
          </div>
        </div>

        <!-- Password Changes -->
        <div>
          <h3 class="text-base font-medium mb-4">Password Changes</h3>
          <div class="space-y-4">
            <input
              type="password"
              formControlName="currentPassword"
              placeholder="Current Password"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            <input
              type="password"
              formControlName="newPassword"
              placeholder="New Password"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="Confirm New Password"
              class="w-full px-4 py-3 bg-[#F5F5F5] rounded text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (profileForm.errors?.['passwordMismatch'] && profileForm.controls.confirmPassword.touched) {
              <p class="text-red-500 text-xs">Passwords do not match.</p>
            }
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-6 pt-4">
          <button
            type="button"
            (click)="onCancel()"
            class="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="isSubmitting"
            class="bg-[#DB4444] hover:bg-[#c53a3a] text-white text-sm font-medium px-10 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AccountProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  isSubmitting = false;

  profileForm = this.fb.nonNullable.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    },
    { validators: this.passwordMatchValidator },
  );

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      this.profileForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        address: user.address || '',
      });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onCancel(): void {
    const user = this.authService.currentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      this.profileForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      this.profileForm.markAsPristine();
      this.profileForm.markAsUntouched();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      toast.error('Please fix the errors before saving.');
      return;
    }

    const { firstName, lastName, email, address, currentPassword, newPassword } = this.profileForm.getRawValue();

    if (newPassword && !currentPassword) {
      toast.error('Please enter your current password to set a new one.');
      return;
    }

    this.isSubmitting = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      this.authService.updateCurrentUser({
        name: `${firstName} ${lastName}`.trim(),
        email,
        address,
      }).subscribe();

      toast.success('Profile updated successfully!');
      this.profileForm.patchValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
      this.profileForm.markAsPristine();
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
