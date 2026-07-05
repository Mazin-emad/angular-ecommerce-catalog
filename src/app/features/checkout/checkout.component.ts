import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { CartService } from '../../shared/services/cart.service';
import { CheckoutService } from '../../shared/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, BreadcrumbComponent],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />

      @if (cartService.items().length > 0) {
        <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20">
            <!-- Left: Billing Details -->
            <div>
              <h2 class="text-2xl font-semibold mb-8">Billing Details</h2>
              <div class="space-y-5">
                <!-- First Name / Last Name -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      formControlName="firstName"
                      placeholder="First Name *"
                      class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    />
                    @if (checkoutForm.controls.firstName.invalid && checkoutForm.controls.firstName.touched) {
                      <p class="text-red-500 text-xs mt-1">First name is required.</p>
                    }
                  </div>
                  <div>
                    <input
                      type="text"
                      formControlName="lastName"
                      placeholder="Last Name *"
                      class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    />
                    @if (checkoutForm.controls.lastName.invalid && checkoutForm.controls.lastName.touched) {
                      <p class="text-red-500 text-xs mt-1">Last name is required.</p>
                    }
                  </div>
                </div>

                <!-- Company -->
                <input
                  type="text"
                  formControlName="company"
                  placeholder="Company"
                  class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                />

                <!-- Address -->
                <div>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Address *"
                    class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                  />
                  @if (checkoutForm.controls.address.invalid && checkoutForm.controls.address.touched) {
                    <p class="text-red-500 text-xs mt-1">Address is required.</p>
                  }
                </div>

                <!-- City -->
                <div>
                  <input
                    type="text"
                    formControlName="city"
                    placeholder="City *"
                    class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                  />
                  @if (checkoutForm.controls.city.invalid && checkoutForm.controls.city.touched) {
                    <p class="text-red-500 text-xs mt-1">City is required.</p>
                  }
                </div>

                <!-- Phone / Email -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="Phone *"
                      class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    />
                    @if (checkoutForm.controls.phone.invalid && checkoutForm.controls.phone.touched) {
                      <p class="text-red-500 text-xs mt-1">Phone is required.</p>
                    }
                  </div>
                  <div>
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="Email *"
                      class="w-full px-4 py-3 bg-gray-100 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    />
                    @if (checkoutForm.controls.email.invalid && checkoutForm.controls.email.touched) {
                      <p class="text-red-500 text-xs mt-1">Valid email is required.</p>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Order Summary -->
            <div>
              <h2 class="text-2xl font-semibold mb-8">Order Summary</h2>
              <div class="border border-gray-200 rounded-lg p-6">
                <!-- Order Items -->
                <div class="space-y-4">
                  @for (item of cartService.items(); track item.id) {
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex items-center gap-3 min-w-0">
                        <img
                          [src]="item.image"
                          [alt]="item.name"
                          class="w-14 h-14 object-contain bg-[#F5F5F5] rounded shrink-0"
                        />
                        <div class="min-w-0">
                          <p class="text-sm font-medium truncate">{{ item.name }}</p>
                          <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                        </div>
                      </div>
                      <span class="text-sm font-medium whitespace-nowrap">\${{ item.price * item.quantity }}</span>
                    </div>
                  }
                </div>

                <!-- Totals -->
                <div class="mt-6 space-y-3">
                  <div class="flex justify-between text-sm pb-3 border-b border-gray-100">
                    <span class="text-gray-600">Subtotal:</span>
                    <span>\${{ cartService.subtotal() }}</span>
                  </div>
                  <div class="flex justify-between text-sm pb-3 border-b border-gray-100">
                    <span class="text-gray-600">Shipping:</span>
                    <span>{{ cartService.shipping() === 0 ? 'Free' : ('$' + cartService.shipping()) }}</span>
                  </div>
                  @if (cartService.discount() > 0) {
                    <div class="flex justify-between text-sm pb-3 border-b border-gray-100 text-green-600">
                      <span>Discount ({{ cartService.discountPercent() }}%):</span>
                      <span>-\${{ cartService.discount() }}</span>
                    </div>
                  }
                  <div class="flex justify-between text-sm font-semibold pt-1">
                    <span>Total:</span>
                    <span>\${{ cartService.total() }}</span>
                  </div>
                </div>

                <!-- Coupon -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      [(ngModel)]="couponInput"
                      [ngModelOptions]="{ standalone: true }"
                      class="flex-1 px-4 py-3 border border-gray-300 rounded text-sm placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    />
                    <button
                      type="button"
                      (click)="applyCoupon()"
                      class="bg-[#DB4444] hover:bg-[#c53a3a] text-white px-6 py-3 rounded text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  @if (couponMessage()) {
                    <p class="text-sm mt-2" [class]="couponSuccess() ? 'text-green-600' : 'text-red-500'">
                      {{ couponMessage() }}
                    </p>
                  }
                </div>

                <!-- Payment Method -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h3 class="text-base font-medium mb-4">Payment Method</h3>
                  <div class="space-y-3">
                    <label
                      class="flex items-center gap-3 border border-gray-200 rounded p-4 cursor-pointer hover:border-gray-400 transition-colors has-[:checked]:border-[#DB4444]"
                    >
                      <input
                        type="radio"
                        formControlName="paymentMethod"
                        value="cod"
                        class="accent-[#DB4444]"
                      />
                      <span class="text-sm">Cash On Delivery</span>
                    </label>
                    <label
                      class="flex items-center gap-3 border border-gray-200 rounded p-4 cursor-pointer hover:border-gray-400 transition-colors has-[:checked]:border-[#DB4444]"
                    >
                      <input
                        type="radio"
                        formControlName="paymentMethod"
                        value="bank"
                        class="accent-[#DB4444]"
                      />
                      <span class="text-sm">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                <!-- Place Order -->
                <button
                  type="submit"
                  [disabled]="isSubmitting || checkoutService.isPlacing()"
                  class="w-full mt-6 bg-[#DB4444] hover:bg-[#c53a3a] text-white py-3 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSubmitting ? 'Placing Order...' : 'Place Order' }}
                </button>
              </div>
            </div>
          </div>
        </form>
      } @else {
        <!-- Empty Cart -->
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.745-4.59 1.745-6.75H5.106M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-8">Add some products to your cart before checking out.</p>
          <a
            routerLink="/cart"
            class="bg-[#DB4444] hover:bg-[#c53a3a] text-white font-medium py-3 px-8 rounded transition-colors duration-200"
          >
            Return to Cart
          </a>
        </div>
      }
    </div>
  `,
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly checkoutService = inject(CheckoutService);
  private readonly authService = inject(AuthService);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Cart', link: '/cart' },
    { label: 'Checkout' },
  ];

  isSubmitting = false;
  couponInput = '';
  couponMessage = signal('');
  couponSuccess = signal(false);

  checkoutForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    company: [''],
    address: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    paymentMethod: ['cod', Validators.required],
  });

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      this.checkoutForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }

  applyCoupon(): void {
    if (!this.couponInput.trim()) {
      this.couponMessage.set('Please enter a coupon code.');
      this.couponSuccess.set(false);
      return;
    }
    const success = this.cartService.applyCoupon(this.couponInput);
    if (success) {
      this.couponMessage.set('Coupon applied successfully!');
      this.couponSuccess.set(true);
    } else {
      this.couponMessage.set('Invalid coupon code. Try SAVE10, SAVE20, or HALF.');
      this.couponSuccess.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      toast.error('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;

    try {
      const billingDetails = {
        firstName: this.checkoutForm.value.firstName ?? '',
        lastName: this.checkoutForm.value.lastName ?? '',
        company: this.checkoutForm.value.company ?? '',
        address: this.checkoutForm.value.address ?? '',
        city: this.checkoutForm.value.city ?? '',
        phone: this.checkoutForm.value.phone ?? '',
        email: this.checkoutForm.value.email ?? '',
      };

      const response = await firstValueFrom(
        this.checkoutService.placeOrder(
          billingDetails,
          this.checkoutForm.value.paymentMethod ?? 'cod',
        ),
      );

      toast.success(response.message);
      this.cartService.clearCart();
      this.router.navigate(['/']);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      this.isSubmitting = false;
      this.checkoutService.reset();
    }
  }
}
