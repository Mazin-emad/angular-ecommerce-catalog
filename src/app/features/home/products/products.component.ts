import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent, Product } from '../../../shared/components/product-card/product-card.component';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
          <span class="text-[#DB4444] font-semibold text-base">Today's</span>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-6 md:mb-12 gap-4 md:gap-6">
          <div class="flex flex-col xs:flex-row xs:items-end gap-4 sm:gap-10 md:gap-12">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold">Flash Sales</h2>
            <div class="flex items-end gap-3 sm:gap-4">
              <div class="flex flex-col items-center">
                <span class="text-[10px] sm:text-xs font-medium text-gray-800 mb-1">Days</span>
                <span class="text-xl sm:text-3xl md:text-4xl font-bold">{{ days() }}</span>
              </div>
              <span class="text-[#DB4444] text-lg sm:text-2xl font-bold mb-1">:</span>
              <div class="flex flex-col items-center">
                <span class="text-[10px] sm:text-xs font-medium text-gray-800 mb-1">Hours</span>
                <span class="text-xl sm:text-3xl md:text-4xl font-bold">{{ hours() }}</span>
              </div>
              <span class="text-[#DB4444] text-lg sm:text-2xl font-bold mb-1">:</span>
              <div class="flex flex-col items-center">
                <span class="text-[10px] sm:text-xs font-medium text-gray-800 mb-1">Minutes</span>
                <span class="text-xl sm:text-3xl md:text-4xl font-bold">{{ minutes() }}</span>
              </div>
              <span class="text-[#DB4444] text-lg sm:text-2xl font-bold mb-1">:</span>
              <div class="flex flex-col items-center">
                <span class="text-[10px] sm:text-xs font-medium text-gray-800 mb-1">Seconds</span>
                <span class="text-xl sm:text-3xl md:text-4xl font-bold">{{ seconds() }}</span>
              </div>
            </div>
          </div>

          <div class="hidden sm:flex gap-2">
            <button
              (click)="scrollLeft()"
              class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              (click)="scrollRight()"
              class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          #scrollContainer
          class="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          @for (product of products; track product.id) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart($event)"
              (wishlist)="onWishlist($event)"
              (quickView)="onQuickView($event)"
              class="snap-start shrink-0"
            />
          }
        </div>

        <div class="flex justify-center mt-8">
          <a
            routerLink="/products"
            class="bg-[#DB4444] hover:bg-[#C73636] text-white font-medium py-3 px-10 rounded transition-colors duration-200 inline-block"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  `,
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private cartService = inject(CartService);

  readonly days = signal('03');
  readonly hours = signal('23');
  readonly minutes = signal('19');
  readonly seconds = signal('56');

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private targetDate: Date;

  readonly products: Product[] = [
    {
      id: '1',
      name: 'HAVIT HV-G92 Gamepad',
      price: 120,
      originalPrice: 160,
      discount: 40,
      rating: 4.5,
      reviewCount: 88,
      image: 'images/products/HAVIT HV-G92 Gamepad.webp',
    },
    {
      id: '2',
      name: 'AK-900 Wired Keyboard',
      price: 960,
      originalPrice: 1160,
      discount: 35,
      rating: 4.5,
      reviewCount: 75,
      image: 'images/products/AK-900 Wired Keyboard.webp',
    },
    {
      id: '3',
      name: 'IPS LCD Gaming Monitor',
      price: 370,
      originalPrice: 400,
      discount: 30,
      rating: 4.5,
      reviewCount: 99,
      image: 'images/products/IPS LCD Gaming Monitor.webp',
    },
    {
      id: '4',
      name: 'S-Series Comfort Chair',
      price: 375,
      originalPrice: 400,
      discount: 25,
      rating: 4.5,
      reviewCount: 99,
      image: 'images/products/S-Series Comfort Chair.webp',
    },
    {
      id: '5',
      name: 'RGB liquid CPU Cooler',
      price: 160,
      originalPrice: 200,
      discount: 20,
      rating: 4,
      reviewCount: 65,
      image: 'images/products/RGB liquid CPU Cooler.webp',
    },
    {
      id: '6',
      name: 'Small BookSelf',
      price: 250,
      originalPrice: 360,
      discount: 30,
      rating: 4.5,
      reviewCount: 45,
      image: 'images/products/Small BookSelf.webp',
    },
  ];

  constructor() {
    this.targetDate = new Date();
    this.targetDate.setDate(this.targetDate.getDate() + 3);
    this.targetDate.setHours(this.targetDate.getHours() + 23);
    this.targetDate.setMinutes(this.targetDate.getMinutes() + 19);
    this.targetDate.setSeconds(this.targetDate.getSeconds() + 56);
  }

  ngOnInit(): void {
    this.updateCountdown();
    this.timerInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private updateCountdown(): void {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.days.set('00');
      this.hours.set('00');
      this.minutes.set('00');
      this.seconds.set('00');
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    this.days.set(d.toString().padStart(2, '0'));
    this.hours.set(h.toString().padStart(2, '0'));
    this.minutes.set(m.toString().padStart(2, '0'));
    this.seconds.set(s.toString().padStart(2, '0'));
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -290, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 290, behavior: 'smooth' });
    }
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

  onWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
  }

  onQuickView(product: Product): void {
    console.log('Quick view:', product.name);
  }
}
