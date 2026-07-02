import { Component, Input } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="group relative flex-shrink-0 w-[270px]">
      <div class="relative bg-[#F5F5F5] rounded-lg overflow-hidden aspect-square mb-4">
        @if (product.discount > 0) {
          <div class="absolute top-3 left-3 z-10 bg-[#DB4444] text-white text-xs font-medium px-3 py-1.5 rounded">
            -{{ product.discount }}%
          </div>
        }
        <div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <img
          [src]="product.image"
          [alt]="product.name"
          class="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
        />
        <button class="absolute bottom-0 left-0 right-0 bg-black text-white text-sm font-medium py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Add To Cart
        </button>
      </div>
      <h3 class="font-medium text-base mb-2 line-clamp-1">{{ product.name }}</h3>
      <div class="flex items-center gap-3 mb-2">
        <span class="text-[#DB4444] font-medium text-base">\${{ product.price }}</span>
        @if (product.originalPrice > product.price) {
          <span class="text-gray-500 line-through text-base">\${{ product.originalPrice }}</span>
        }
      </div>
      <div class="flex items-center gap-1">
        <div class="flex">
          @for (star of [1, 2, 3, 4, 5]; track star) {
            @if (star <= product.rating) {
              <svg class="w-4 h-4 text-[#FFAD33]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            } @else if (star - 0.5 <= product.rating) {
              <svg class="w-4 h-4 text-[#FFAD33]" fill="currentColor" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stop-color="currentColor" />
                    <stop offset="50%" stop-color="#D1D5DB" />
                  </linearGradient>
                </defs>
                <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            } @else {
              <svg class="w-4 h-4 text-[#D1D5DB]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
          }
        </div>
        <span class="text-gray-500 text-sm">({{ product.reviewCount }})</span>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}
