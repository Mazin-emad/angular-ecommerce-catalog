import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule, BreadcrumbComponent],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />

      @if (cartService.items().length > 0) {
        <!-- Cart Table -->
        <div class="mb-8">
          <!-- Table Header -->
          <div class="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-4 px-6 bg-gray-100 rounded-t-lg text-sm font-medium">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span class="text-right">Subtotal</span>
          </div>

          <!-- Table Rows -->
          @for (item of cartService.items(); track item.id) {
            <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-6 px-6 border-b border-gray-200 items-center">
              <!-- Product -->
              <div class="flex items-center gap-4">
                <div class="relative shrink-0">
                  <button
                    (click)="removeItem(item.id)"
                    class="absolute -top-1 -left-1 w-5 h-5 bg-[#DB4444] text-white rounded-full flex items-center justify-center text-xs hover:bg-[#c53a3a] transition-colors z-10"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                  <img
                    [src]="item.image"
                    [alt]="item.name"
                    class="w-16 h-16 object-contain bg-[#F5F5F5] rounded p-1"
                  />
                </div>
                <span class="font-medium text-sm">{{ item.name }}</span>
              </div>

              <!-- Price -->
              <span class="text-sm">\${{ item.price }}</span>

              <!-- Quantity -->
              <div class="flex items-center">
                <div class="relative inline-flex items-center border border-gray-300 rounded">
                  <input
                    type="number"
                    [ngModel]="item.quantity"
                    (ngModelChange)="updateQuantity(item.id, $event)"
                    min="1"
                    class="w-12 h-9 text-center text-sm border-0 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <div class="flex flex-col absolute right-1">
                    <button
                      (click)="incrementQuantity(item.id, item.quantity)"
                      class="text-gray-400 hover:text-gray-600 leading-none"
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      (click)="decrementQuantity(item.id, item.quantity)"
                      class="text-gray-400 hover:text-gray-600 leading-none"
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Subtotal -->
              <span class="text-sm font-medium text-right">\${{ item.price * item.quantity }}</span>
            </div>
          }
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between mb-16">
          <a
            routerLink="/products"
            class="border border-gray-400 px-8 py-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Return To Shop
          </a>
          <button
            (click)="updateCart()"
            class="border border-gray-400 px-8 py-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Update Cart
          </button>
        </div>

        <!-- Coupon + Cart Total -->
        <div class="flex flex-col lg:flex-row items-start justify-between gap-8 mb-16">
          <!-- Coupon -->
          <div class="w-full lg:max-w-md">
            <div class="flex items-center gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                [(ngModel)]="couponInput"
                class="flex-1 border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors"
              />
              <button
                (click)="applyCoupon()"
                class="bg-[#DB4444] hover:bg-[#c53a3a] text-white px-8 py-3 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >
                Apply Coupon
              </button>
            </div>
            @if (couponMessage()) {
              <p class="text-sm mt-3" [class]="couponSuccess() ? 'text-green-600' : 'text-red-500'">
                {{ couponMessage() }}
              </p>
            }
          </div>

          <!-- Cart Total -->
          <div class="w-full lg:w-[400px] border border-gray-300 rounded-lg p-8">
            <h2 class="text-lg font-semibold mb-6">Cart Total</h2>
            <div class="space-y-4">
              <div class="flex justify-between text-sm pb-4 border-b border-gray-200">
                <span>Subtotal:</span>
                <span>\${{ cartService.subtotal() }}</span>
              </div>
              <div class="flex justify-between text-sm pb-4 border-b border-gray-200">
                <span>Shipping:</span>
                <span>{{ cartService.shipping() === 0 ? 'Free' : ('$' + cartService.shipping()) }}</span>
              </div>
              @if (cartService.discount() > 0) {
                <div class="flex justify-between text-sm pb-4 border-b border-gray-200 text-green-600">
                  <span>Discount ({{ cartService.discountPercent() }}%):</span>
                  <span>-\${{ cartService.discount() }}</span>
                </div>
              }
              <div class="flex justify-between text-sm font-semibold">
                <span>Total:</span>
                <span>\${{ cartService.total() }}</span>
              </div>
            </div>
            <a
              routerLink="/checkout"
              class="block w-full text-center bg-[#DB4444] hover:bg-[#c53a3a] text-white py-3 rounded text-sm font-medium transition-colors"
            >
              Proceed to checkout
            </a>
          </div>
        </div>
      } @else {
        <!-- Empty Cart -->
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.745-4.59 1.745-6.75H5.106M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-8">Add some products to your cart to get started.</p>
          <a
            routerLink="/products"
            class="bg-[#DB4444] hover:bg-[#c53a3a] text-white font-medium py-3 px-8 rounded transition-colors duration-200"
          >
            Continue Shopping
          </a>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  readonly cartService = inject(CartService);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Cart' },
  ];

  couponInput = '';
  couponMessage = signal('');
  couponSuccess = signal(false);

  updateQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  incrementQuantity(itemId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(itemId, currentQuantity + 1);
  }

  decrementQuantity(itemId: string, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(itemId, currentQuantity - 1);
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  updateCart(): void {
    this.couponMessage.set('Cart updated successfully.');
    this.couponSuccess.set(true);
    setTimeout(() => this.couponMessage.set(''), 2000);
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
}
