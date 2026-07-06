import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { toast } from 'ngx-sonner';
import { ProductService, ProductDetail } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { WishlistService, WishlistItem } from '../../../shared/services/wishlist.service';
import { ProductCardComponent, Product } from '../../../shared/components/product-card/product-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  template: `
    @if (loading()) {
      <!-- Loading Skeleton -->
      <div class="py-8">
        <div class="h-4 w-64 bg-gray-200 rounded mb-12 animate-pulse"></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div class="flex gap-4">
            <div class="flex flex-col gap-3">
              @for (i of [1,2,3,4]; track i) {
                <div class="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
              }
            </div>
            <div class="flex-1 bg-gray-200 rounded-lg aspect-square animate-pulse"></div>
          </div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div class="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    } @else if (!product()) {
      <!-- Product Not Found -->
      <div class="flex flex-col items-center justify-center min-h-[50vh] text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <h2 class="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p class="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <a
          routerLink="/products"
          class="bg-[#DB4444] hover:bg-[#c53a3a] text-white font-medium py-3 px-8 rounded transition-colors duration-200"
        >
          Browse Products
        </a>
      </div>
    } @else {
      <!-- Breadcrumb -->
      <app-breadcrumb [items]="breadcrumbs()" />

      <!-- Product Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
        <!-- Gallery -->
        <div class="flex flex-col-reverse sm:flex-row gap-4">
          <!-- Thumbnails -->
          <div class="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
            @for (img of product()!.gallery; track img; let i = $index) {
              <button
                (click)="selectedImage.set(i)"
                class="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
                [class]="selectedImage() === i ? 'border-[#DB4444]' : 'border-gray-200 hover:border-gray-400'"
              >
                <img
                  [src]="img"
                  [alt]="product()!.name + ' thumbnail ' + (i + 1)"
                  class="w-full h-full object-contain bg-[#F5F5F5] p-1"
                />
              </button>
            }
          </div>
          <!-- Main Image -->
          <div class="flex-1 bg-[#F5F5F5] rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            <img
              [src]="product()!.gallery[selectedImage()]"
              [alt]="product()!.name"
              class="w-full h-full object-contain p-6 transition-opacity duration-200"
            />
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold mb-4">{{ product()!.name }}</h1>

          <!-- Rating & Stock -->
          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center gap-1">
              @for (star of [1,2,3,4,5]; track star) {
                @if (star <= product()!.rating) {
                  <svg class="w-4 h-4 text-[#FFAD33]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                } @else {
                  <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
              }
            </div>
            <span class="text-sm text-gray-500">({{ product()!.reviewCount }} Reviews)</span>
            <span class="text-gray-300">|</span>
            @if (product()!.inStock) {
              <span class="text-sm text-[#00FF66]">In Stock</span>
            } @else {
              <span class="text-sm text-red-500">Out of Stock</span>
            }
          </div>

          <!-- Price -->
          <div class="text-3xl font-medium mb-6">
            \${{ product()!.price }}
            @if (product()!.discount > 0) {
              <span class="text-lg text-gray-400 line-through ml-3">\${{ product()!.originalPrice }}</span>
            }
          </div>

          <!-- Description -->
          <p class="text-gray-600 text-sm leading-relaxed mb-6">{{ product()!.description }}</p>

          <hr class="border-gray-200 mb-6" />

          <!-- Colours -->
          @if (product()!.colors && product()!.colors!.length > 0) {
            <div class="flex items-center gap-4 mb-6">
              <span class="text-sm font-medium">Colours:</span>
              <div class="flex items-center gap-2">
                @for (color of product()!.colors; track color) {
                  <button
                    (click)="selectedColor.set(color)"
                    class="w-7 h-7 rounded-full border-2 transition-all"
                    [class]="selectedColor() === color ? 'border-gray-600 ring-2 ring-gray-300' : 'border-gray-300 hover:border-gray-400'"
                    [style.background]="color"
                  ></button>
                }
              </div>
            </div>
          }

          <!-- Size -->
          @if (product()!.sizes && product()!.sizes!.length > 0) {
            <div class="flex items-center gap-4 mb-6">
              <span class="text-sm font-medium">Size:</span>
              <div class="flex items-center gap-2">
                @for (size of product()!.sizes; track size) {
                  <button
                    (click)="selectedSize.set(size)"
                    class="w-10 h-10 border rounded text-sm font-medium transition-colors"
                    [class]="selectedSize() === size
                      ? 'bg-[#DB4444] text-white border-[#DB4444]'
                      : 'border-gray-300 text-gray-700 hover:border-gray-500'"
                  >
                    {{ size }}
                  </button>
                }
              </div>
            </div>
          }

          <!-- Quantity + Buy Now + Wishlist -->
          <div class="flex flex-wrap items-center gap-4 mb-8">
            <!-- Quantity -->
            <div class="flex items-center border border-gray-300 rounded">
              <button
                (click)="decrementQuantity()"
                class="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span class="w-12 text-center text-sm font-medium">{{ quantity() }}</span>
              <button
                (click)="incrementQuantity()"
                class="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>

            <!-- Buy Now -->
            <button
              (click)="buyNow()"
              class="bg-[#DB4444] hover:bg-[#c53a3a] text-white text-sm font-medium px-8 py-2.5 rounded transition-colors"
            >
              Buy Now
            </button>

            <!-- Wishlist -->
            <button
              (click)="toggleWishlist()"
              class="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                [attr.fill]="isInWishlist() ? '#DB4444' : 'none'"
                [attr.stroke]="isInWishlist() ? '#DB4444' : 'currentColor'"
                viewBox="0 0 24 24"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>

          <!-- Delivery & Return -->
          <div class="border border-gray-300 rounded-lg divide-y divide-gray-200">
            <!-- Free Delivery -->
            <div class="flex items-start gap-4 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-1.367a3 3 0 01-2.179-.918l-1.367-1.368a1.5 1.5 0 00-1.07-.446H3.375m3.375 0V5.625c0-.621.504-1.125 1.125-1.125h4.125c.342 0 .663.158.886.425l3.25 3.25a1.5 1.5 0 01.436 1.07V14.25m0 0h3.375" />
              </svg>
              <div>
                <p class="text-sm font-medium">Free Delivery</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  <a href="#" class="underline hover:text-gray-700">Enter your postal code</a> for Delivery Availability
                </p>
              </div>
            </div>
            <!-- Return Delivery -->
            <div class="flex items-start gap-4 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              <div>
                <p class="text-sm font-medium">Return Delivery</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  Free 30 Days Delivery Returns. <a href="#" class="underline hover:text-gray-700">Details</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Items -->
      @if (relatedProducts().length > 0) {
        <div class="mb-16">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
            <span class="text-[#DB4444] font-semibold text-base">Related Item</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (rp of relatedProducts(); track rp.id) {
              <app-product-card
                [product]="rp"
                (addToCart)="onAddToCart($event)"
                (wishlist)="onWishlist($event)"
              />
            }
          </div>
        </div>
      }
    }
  `,
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  product = signal<ProductDetail | null>(null);
  loading = signal(true);
  selectedImage = signal(0);
  selectedColor = signal('');
  selectedSize = signal('');
  quantity = signal(1);
  relatedProducts = signal<Product[]>([]);

  private routeSub?: Subscription;
  private wishlistSub?: Subscription;

  isInWishlist = signal(false);

  breadcrumbs = signal<BreadcrumbItem[]>([]);

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.wishlistSub?.unsubscribe();
  }

  private loadProduct(id: string): void {
    this.loading.set(true);
    this.product.set(null);
    this.selectedImage.set(0);
    this.quantity.set(1);
    this.selectedColor.set('');
    this.selectedSize.set('');

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product ?? null);
        if (product) {
          if (product.colors && product.colors.length > 0) {
            this.selectedColor.set(product.colors[0]);
          }
          if (product.sizes && product.sizes.length > 0) {
            this.selectedSize.set(product.sizes[0]);
          }
          this.breadcrumbs.set([
            { label: 'Home', link: '/' },
            { label: product.category, link: '/products' },
            { label: product.name },
          ]);
          this.checkWishlist(product.id);
          this.loadRelated(product.id, product.category);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private checkWishlist(productId: string): void {
    this.isInWishlist.set(this.wishlistService.items().some(i => i.id === productId));
    this.wishlistSub?.unsubscribe();
    this.wishlistSub = undefined;
  }

  private loadRelated(productId: string, category: string): void {
    this.productService.getRelatedProducts(productId, category).subscribe({
      next: (products) => {
        this.relatedProducts.set(products.map(p => ({
          ...p,
          originalPrice: p.originalPrice,
          reviewCount: p.reviewCount,
        })));
      }
    });
  }

  incrementQuantity(): void {
    this.quantity.set(this.quantity() + 1);
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: this.quantity(),
    });
    toast.success(`${p.name} added to cart!`);
  }

  buyNow(): void {
    this.addToCart();
  }

  toggleWishlist(): void {
    const p = this.product();
    if (!p) return;

    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(p.id);
      this.isInWishlist.set(false);
      toast.success(`${p.name} removed from wishlist.`);
    } else {
      this.wishlistService.addToWishlist({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        image: p.image,
      });
      this.isInWishlist.set(true);
      toast.success(`${p.name} added to wishlist!`);
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
    toast.success(`${product.name} added to cart!`);
  }

  onWishlist(product: Product): void {
    const exists = this.wishlistService.items().some(i => i.id === product.id);
    if (exists) {
      this.wishlistService.removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist.`);
    } else {
      this.wishlistService.addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
      });
      toast.success(`${product.name} added to wishlist!`);
    }
  }
}
