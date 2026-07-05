import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent, Product } from '../../../shared/components/product-card/product-card.component';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-best-selling-products',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
          <span class="text-[#DB4444] font-semibold text-base">This Month</span>
        </div>

        <div class="flex sm:flex-row sm:items-end justify-between mb-6 md:mb-12 gap-4">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold">Best Selling Products</h2>
          <a
            routerLink="/products"
            class="hidden sm:inline-block bg-[#DB4444] hover:bg-[#C73636] text-white font-medium py-3 px-8 rounded transition-colors duration-200 text-center"
          >
            View All
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
          @for (product of products; track product.id) {
            <app-product-card
              [product]="product"
              (addToCart)="onAddToCart($event)"
              (wishlist)="onWishlist($event)"
              (quickView)="onQuickView($event)"
            />
          }
        </div>

        <div class="flex sm:hidden justify-center mt-6">
          <a
            routerLink="/products"
            class="bg-[#DB4444] hover:bg-[#C73636] text-white font-medium py-3 px-10 rounded transition-colors duration-200 inline-block"
          >
            View All
          </a>
        </div>
      </div>
    </section>
  `,
})
export class BestSellingProductsComponent {
  private cartService = inject(CartService);

  readonly products: Product[] = [
    {
      id: '7',
      name: 'The north coat',
      price: 260,
      originalPrice: 360,
      discount: 0,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/The north coat.webp',
    },
    {
      id: '8',
      name: 'Gucci duffle bag',
      price: 960,
      originalPrice: 1160,
      discount: 0,
      rating: 4.5,
      reviewCount: 65,
      image: 'images/products/Light-Gucci-Savoy-medium-duffle-bag 1.webp',
    },
    {
      id: '9',
      name: 'RGB liquid CPU Cooler',
      price: 160,
      originalPrice: 170,
      discount: 0,
      rating: 4.5,
      reviewCount: 65,
      image: 'images/products/RGB liquid CPU Cooler.webp',
    },
    {
      id: '10',
      name: 'Small BookSelf',
      price: 360,
      originalPrice: 360,
      discount: 0,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/Small BookSelf.webp',
    },
  ];

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
