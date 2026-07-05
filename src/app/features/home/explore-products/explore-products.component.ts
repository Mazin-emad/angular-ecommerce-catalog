import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent, Product } from '../../../shared/components/product-card/product-card.component';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-explore-products',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
          <span class="text-[#DB4444] font-semibold text-base">Our Products</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-12 gap-4">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold">Explore Our Products</h2>
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
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          @for (product of products; track product.id) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart($event)"
              (wishlist)="onWishlist($event)"
              (quickView)="onQuickView($event)"
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
export class ExploreProductsComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private cartService = inject(CartService);

  readonly products: Product[] = [
    {
      id: '11',
      name: 'Breed Dry Dog Food',
      price: 100,
      originalPrice: 100,
      discount: 0,
      rating: 3,
      reviewCount: 35,
      image: 'images/products/Breed Dry Dog Food.webp',
    },
    {
      id: '12',
      name: 'CANON EOS DSLR Camera',
      price: 360,
      originalPrice: 360,
      discount: 0,
      rating: 5,
      reviewCount: 95,
      image: 'images/products/CANON EOS DSLR Camera.webp',
    },
    {
      id: '13',
      name: 'ASUS FHD Gaming Laptop',
      price: 700,
      originalPrice: 700,
      discount: 0,
      rating: 4.5,
      reviewCount: 325,
      image: 'images/products/ASUS FHD Gaming Laptop.webp',
    },
    {
      id: '14',
      name: 'Curology Product Set',
      price: 500,
      originalPrice: 500,
      discount: 0,
      rating: 4,
      reviewCount: 145,
      image: 'images/products/Curology Product Set .webp',
    },
    {
      id: '15',
      name: 'Kids Electric Car',
      price: 960,
      originalPrice: 960,
      discount: 0,
      rating: 4.5,
      reviewCount: 65,
      isNew: true,
      image: 'images/products/Kids Electric Car.webp',
      colors: ['#DB4444', '#00FF66'],
    },
    {
      id: '16',
      name: 'Jr. Zoom Soccer Cleats',
      price: 1160,
      originalPrice: 1160,
      discount: 0,
      rating: 4,
      reviewCount: 35,
      image: 'images/products/Jr. Zoom Soccer Cleats.webp',
      colors: ['#FFD700', '#DB4444'],
    },
    {
      id: '17',
      name: 'GP11 Shooter USB Gamepad',
      price: 660,
      originalPrice: 660,
      discount: 0,
      rating: 4,
      reviewCount: 55,
      isNew: true,
      image: 'images/products/GP11 Shooter USB Gamepad.webp',
      colors: ['#000000', '#DB4444'],
    },
    {
      id: '18',
      name: 'Quilted Satin Jacket',
      price: 660,
      originalPrice: 660,
      discount: 0,
      rating: 4.5,
      reviewCount: 55,
      image: 'images/products/Quilted Satin Jacket.webp',
    },
  ];

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
