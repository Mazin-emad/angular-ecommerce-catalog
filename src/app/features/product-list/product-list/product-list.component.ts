import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, ProductDetail } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { ProductCardComponent, Product } from '../../../shared/components/product-card/product-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent, FormsModule],
  template: `
    <div class="py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <app-breadcrumb [items]="breadcrumbs" />
      </div>

      <!-- Search + Sort Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div class="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            [(ngModel)]="searchInput"
            (ngModelChange)="onSearchChange()"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-gray-500 transition-colors"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
          <select
            [ngModel]="sortOption()"
            (ngModelChange)="onSortChange($event)"
            class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-500 transition-colors bg-white"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
        <!-- Category Filter Sidebar -->
        <aside>
          <div class="flex items-center justify-between lg:mb-6">
            <h3 class="text-base font-semibold">Categories</h3>
            @if (selectedCategory()) {
              <button
                (click)="clearCategory()"
                class="text-xs text-[#DB4444] hover:underline lg:hidden"
              >
                Clear
              </button>
            }
          </div>
          <!-- Mobile toggle -->
          <button
            (click)="catOpen.set(!catOpen())"
            class="flex lg:hidden items-center justify-between w-full border border-gray-200 rounded px-3 py-2 mt-2 text-sm"
          >
            <span>{{ selectedCategory() || 'All Categories' }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 transition-transform"
              [class.rotate-180]="catOpen()"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <nav
            class="mt-4 lg:mt-0 space-y-2"
            [class.hidden]="!catOpen()"
            [class.lg:block]="true"
          >
            <button
              (click)="selectCategory('')"
              class="block w-full text-left text-sm transition-colors py-1.5 px-2 rounded"
              [class]="selectedCategory() === '' ? 'text-[#DB4444] font-medium bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              All Products
            </button>
            @for (cat of categories; track cat) {
              <button
                (click)="selectCategory(cat)"
                class="block w-full text-left text-sm transition-colors py-1.5 px-2 rounded"
                [class]="selectedCategory() === cat ? 'text-[#DB4444] font-medium bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                {{ cat }}
              </button>
            }
          </nav>
        </aside>

        <!-- Product Grid -->
        <div>
          @if (loading()) {
            <!-- Loading skeleton -->
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="animate-pulse">
                  <div class="bg-gray-200 rounded-lg aspect-square mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              }
            </div>
          } @else if (displayedProducts().length === 0) {
            <!-- Empty state -->
            <div class="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 class="text-lg font-semibold mb-1">No products found</h3>
              <p class="text-gray-500 text-sm mb-6">Try adjusting your search or filter criteria.</p>
              <button
                (click)="clearAllFilters()"
                class="bg-[#DB4444] hover:bg-[#c53a3a] text-white text-sm font-medium px-6 py-2.5 rounded transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          } @else {
            <!-- Results count -->
            <p class="text-sm text-gray-500 mb-4">
              Showing {{ displayedProducts().length }} of {{ filteredProducts().length }} products
            </p>

            <!-- Product Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              @for (product of displayedProducts(); track product.id) {
                <app-product-card
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                  (wishlist)="onWishlist($event)"
                />
              }
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="flex items-center justify-center gap-2 mt-12">
                <button
                  (click)="goToPage(currentPage() - 1)"
                  [disabled]="currentPage() <= 1"
                  class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                @for (p of pageNumbers(); track p) {
                  <button
                    (click)="goToPage(p)"
                    class="w-10 h-10 rounded text-sm font-medium transition-colors"
                    [class]="currentPage() === p ? 'bg-[#DB4444] text-white' : 'border border-gray-300 hover:bg-gray-50'"
                  >
                    {{ p }}
                  </button>
                }
                <button
                  (click)="goToPage(currentPage() + 1)"
                  [disabled]="currentPage() >= totalPages()"
                  class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Products' },
  ];

  // State
  allProducts: ProductDetail[] = [];
  filteredProducts = signal<ProductDetail[]>([]);
  displayedProducts = signal<ProductDetail[]>([]);
  categories: string[] = [];

  // Filters
  selectedCategory = signal('');
  searchQuery = signal('');
  searchInput = '';
  sortOption = signal('');
  currentPage = signal(1);
  pageSize = 12;

  // UI
  loading = signal(true);
  catOpen = signal(false);

  private paramSub?: Subscription;
  private ignoreNextParamUpdate = false;

  totalPages = signal(0);
  pageNumbers = signal<number[]>([]);

  ngOnInit(): void {
    this.loadProducts();
    this.paramSub = this.route.queryParams.subscribe(params => {
      if (this.ignoreNextParamUpdate) {
        this.ignoreNextParamUpdate = false;
        return;
      }
      const category = params['category'] || '';
      const sort = params['sort'] || '';
      const search = params['search'] || '';
      const page = parseInt(params['page'], 10) || 1;

      this.selectedCategory.set(category);
      this.sortOption.set(sort);
      this.searchQuery.set(search);
      this.searchInput = search;
      this.currentPage.set(page);
      this.catOpen.set(false);

      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.categories = [...new Set(products.map(p => p.category))].sort();
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private applyFilters(): void {
    let result = [...this.allProducts];

    // Category filter
    const cat = this.selectedCategory();
    if (cat) {
      result = result.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    // Search filter
    const search = this.searchQuery().toLowerCase().trim();
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Sort
    const sort = this.sortOption();
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    this.filteredProducts.set(result);

    // Paginate
    const page = this.currentPage();
    const totalPages = Math.max(1, Math.ceil(result.length / this.pageSize));
    this.totalPages.set(totalPages);

    if (page > totalPages) {
      this.currentPage.set(totalPages);
    }

    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts.set(result.slice(start, end));

    // Page numbers
    this.pageNumbers.set(
      Array.from({ length: totalPages }, (_, i) => i + 1)
    );
  }

  private syncUrl(): void {
    const params: Record<string, string> = {};
    if (this.selectedCategory()) params['category'] = this.selectedCategory();
    if (this.sortOption()) params['sort'] = this.sortOption();
    if (this.searchInput.trim()) params['search'] = this.searchInput.trim();
    if (this.currentPage() > 1) params['page'] = String(this.currentPage());

    this.ignoreNextParamUpdate = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: '',
      replaceUrl: true,
    });
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.currentPage.set(1);
    this.catOpen.set(false);
    this.syncUrl();
  }

  clearCategory(): void {
    this.selectCategory('');
  }

  onSortChange(value: string): void {
    this.sortOption.set(value);
    this.currentPage.set(1);
    this.syncUrl();
  }

  onSearchChange(): void {
    this.searchQuery.set(this.searchInput);
    this.currentPage.set(1);
    this.syncUrl();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.syncUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearAllFilters(): void {
    this.searchInput = '';
    this.selectedCategory.set('');
    this.sortOption.set('');
    this.currentPage.set(1);
    this.syncUrl();
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
