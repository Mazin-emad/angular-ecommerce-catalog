import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../shared/services/wishlist.service';
import { CartService } from '../../shared/services/cart.service';
import { ProductCardComponent, Product } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <div class="py-8">
      @if (wishlistService.items().length > 0) {
        <!-- Wishlist Header -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-xl font-medium">Wishlist ({{ wishlistService.itemCount() }})</h1>
          <button
            (click)="moveAllToBag()"
            class="border border-gray-400 px-8 py-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Move All To Bag
          </button>
        </div>

        <!-- Wishlist Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          @for (item of wishlistService.items(); track item.id) {
            <div class="group relative">
              <div class="relative bg-[#F5F5F5] rounded-lg overflow-hidden aspect-square mb-4">
                @if (item.discount > 0) {
                  <div class="absolute top-3 left-3 z-10 bg-[#DB4444] text-white text-xs font-medium px-3 py-1.5 rounded">
                    -{{ item.discount }}%
                  </div>
                }
                <button
                  (click)="removeFromWishlist(item.id)"
                  class="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                <img
                  [src]="item.image"
                  [alt]="item.name"
                  class="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                />
                <button
                  (click)="addToCart(item)"
                  class="absolute bottom-0 left-0 right-0 bg-black text-white text-sm font-medium py-2.5 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.745-4.59 1.745-6.75H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  Add To Cart
                </button>
              </div>
              <a [routerLink]="['/products', item.id]">
                <h3 class="font-medium text-base mb-2 line-clamp-1 hover:text-[#DB4444] transition-colors">{{ item.name }}</h3>
              </a>
              <div class="flex items-center gap-3">
                <span class="text-[#DB4444] font-medium text-base">\${{ item.price }}</span>
                @if (item.originalPrice > item.price) {
                  <span class="text-gray-500 line-through text-base">\${{ item.originalPrice }}</span>
                }
              </div>
            </div>
          }
        </div>

        <!-- Just For You Section -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
            <span class="text-[#DB4444] font-semibold text-base">Just For You</span>
          </div>

          <div class="flex items-center justify-between mb-8">
            <div></div>
            <a
              routerLink="/products"
              class="border border-gray-400 px-8 py-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              See All
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (product of justForYouProducts; track product.id) {
              <app-product-card
                [product]="product"
                (addToCart)="onAddToCart($event)"
              />
            }
          </div>
        </div>
      } @else {
        <!-- Empty Wishlist -->
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h2 class="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p class="text-gray-500 mb-8">Add items that you like to your wishlist.</p>
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
export class WishlistComponent {
  readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  readonly justForYouProducts: Product[] = this.wishlistService.justForYou().map(item => ({
    ...item,
    originalPrice: item.originalPrice,
    reviewCount: item.reviewCount ?? 0,
  }));

  addToCart(item: WishlistItem): void {
    this.cartService.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  removeFromWishlist(itemId: string): void {
    this.wishlistService.removeFromWishlist(itemId);
  }

  moveAllToBag(): void {
    const items = this.wishlistService.items();
    items.forEach(item => this.addToCart(item));
    this.wishlistService.clearWishlist();
  }
}
