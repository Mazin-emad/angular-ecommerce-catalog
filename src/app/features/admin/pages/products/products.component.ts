import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService, ProductDetail } from '../../../../shared/services/product.service';
import { CategoryService, Category } from '../../../../shared/services/category.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, DialogComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Products</h2>
          <p class="text-sm text-gray-500 mt-1">{{ filteredProducts().length }} products</p>
        </div>
        <button (click)="openAddDialog()"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#DB4444] text-white text-sm font-medium rounded-lg hover:bg-[#c23434] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Product
        </button>
      </div>

      <!-- Search + Sort -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search products..." [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)"
            class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444] transition-colors" />
        </div>
        <select [value]="sortField()" (change)="sortField.set($any($event.target).value)"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]">
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="discount">Discount</option>
        </select>
        <button (click)="sortDir.set(sortDir() === 'asc' ? 'desc' : 'asc')"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          {{ sortDir() === 'asc' ? '↑ Asc' : '↓ Desc' }}
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left text-gray-500 bg-gray-50">
                <th class="px-4 py-3 font-medium">Product</th>
                <th class="px-4 py-3 font-medium">Category</th>
                <th class="px-4 py-3 font-medium">Price</th>
                <th class="px-4 py-3 font-medium">Discount</th>
                <th class="px-4 py-3 font-medium">Stock</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of paginatedProducts(); track product.id; let i = $index) {
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <img [src]="product.image" [alt]="product.name" class="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <span class="font-medium text-gray-900 truncate max-w-[200px]">{{ product.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ product.category }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ product.price | currency }}</td>
                  <td class="px-4 py-3">{{ product.discount ? product.discount + '% off' : '—' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      [class]="product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="openEditDialog(product)"
                        class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-600" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button (click)="confirmDelete(product)"
                        class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-600" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-4 py-10 text-center text-gray-500">No products found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p class="text-sm text-gray-500">
            Showing {{ (currentPage() - 1) * pageSize + 1 }}–{{ Math.min(currentPage() * pageSize, filteredProducts().length) }} of {{ filteredProducts().length }}
          </p>
          <div class="flex gap-1">
            <button (click)="prevPage()" [disabled]="currentPage() <= 1"
              class="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">Prev</button>
            @for (p of pages(); track p) {
              <button (click)="currentPage.set(p)"
                class="px-3 py-1 text-sm border rounded-lg transition-colors"
                [class]="p === currentPage() ? 'bg-[#DB4444] text-white border-[#DB4444]' : 'border-gray-200 hover:bg-gray-50'">{{ p }}</button>
            }
            <button (click)="nextPage()" [disabled]="currentPage() >= totalPages()"
              class="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <app-dialog [open]="dialogOpen()" [title]="editingProduct() ? 'Edit Product' : 'Add Product'" (close)="closeDialog()">
      <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select formControlName="category" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]">
              @for (cat of categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" formControlName="price" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
            <input type="number" formControlName="originalPrice" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input type="number" formControlName="discount" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea formControlName="description" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]"></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="text" formControlName="image" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gallery URLs (comma-separated)</label>
            <input type="text" formControlName="galleryStr" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input type="checkbox" formControlName="inStock" class="rounded border-gray-300 text-[#DB4444]" />
            <span class="text-sm text-gray-700">In Stock</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" formControlName="isNew" class="rounded border-gray-300 text-[#DB4444]" />
            <span class="text-sm text-gray-700">New</span>
          </label>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" (click)="closeDialog()" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
          <button type="submit" [disabled]="productForm.invalid"
            class="px-4 py-2 bg-[#DB4444] text-white text-sm font-medium rounded-lg hover:bg-[#c23434] disabled:opacity-50 transition-colors">
            {{ editingProduct() ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </app-dialog>

    <!-- Delete Confirmation -->
    <app-dialog [open]="deleteDialogOpen()" title="Delete Product" (close)="deleteDialogOpen.set(false)">
      <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{{ deletingProduct()?.name }}</strong>? This action cannot be undone.</p>
      <div class="flex justify-end gap-3">
        <button (click)="deleteDialogOpen.set(false)" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
        <button (click)="doDelete()" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Delete</button>
      </div>
    </app-dialog>
  `,
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  readonly Math = Math;
  readonly searchQuery = signal('');
  readonly sortField = signal<'name' | 'price' | 'discount'>('name');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly currentPage = signal(1);
  readonly pageSize = 8;

  readonly dialogOpen = signal(false);
  readonly deleteDialogOpen = signal(false);
  readonly editingProduct = signal<ProductDetail | null>(null);
  readonly deletingProduct = signal<ProductDetail | null>(null);

  readonly products = signal<ProductDetail[]>([]);
  readonly categories: string[] = [];

  private readonly allProductsList: ProductDetail[] = [];

  constructor() {
    this.categories = [
      'Gaming', 'Computers', 'Monitors', 'Furniture', 'Pet Supplies',
      'Cameras', 'Laptops', 'Beauty', 'Toys', 'Sports', 'Fashion',
    ];
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
      (this as any).allProductsList = products;
    });
  }

  readonly filteredProducts = () => {
    const q = this.searchQuery().toLowerCase();
    let list = this.products().filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    const field = this.sortField();
    list.sort((a, b) => {
      const aVal = field === 'price' ? a.price : field === 'discount' ? a.discount : a.name;
      const bVal = field === 'price' ? b.price : field === 'discount' ? b.discount : b.name;
      const cmp = typeof aVal === 'string' ? (aVal as string).localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return this.sortDir() === 'asc' ? cmp : -cmp;
    });
    return list;
  };

  readonly totalPages = () => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize));

  readonly paginatedProducts = () => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  };

  readonly pages = () => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  };

  prevPage() { if (this.currentPage() > 1) this.currentPage.update(v => v - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(v => v + 1); }

  readonly productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['Gaming', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    originalPrice: [0, [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0), Validators.max(100)]],
    description: [''],
    image: [''],
    galleryStr: [''],
    inStock: [true],
    isNew: [false],
  });

  private resetForm() {
    this.productForm.reset({
      name: '', category: 'Gaming', price: 0, originalPrice: 0,
      discount: 0, description: '', image: '', galleryStr: '',
      inStock: true, isNew: false,
    });
  }

  openAddDialog() {
    this.editingProduct.set(null);
    this.resetForm();
    this.dialogOpen.set(true);
  }

  openEditDialog(product: ProductDetail) {
    this.editingProduct.set(product);
    this.productForm.setValue({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      description: product.description,
      image: product.image,
      galleryStr: product.gallery.join(', '),
      inStock: product.inStock,
      isNew: product.isNew ?? false,
    });
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
    this.editingProduct.set(null);
  }

  saveProduct() {
    if (this.productForm.invalid) return;
    const val = this.productForm.value;
    const data = {
      name: val.name!,
      category: val.category!,
      price: val.price!,
      originalPrice: val.originalPrice!,
      discount: val.discount!,
      description: val.description!,
      image: val.image! || 'images/placeholder.webp',
      gallery: val.galleryStr! ? val.galleryStr!.split(/,\s*/) : [val.image! || 'images/placeholder.webp'],
      inStock: val.inStock!,
      isNew: val.isNew!,
      rating: 0,
      reviewCount: 0,
    };

    const edit = this.editingProduct();
    if (edit) {
      this.productService.updateProduct(edit.id, data).subscribe(() => {
        this.refreshProducts();
        toast.success('Product updated successfully');
        this.closeDialog();
      });
    } else {
      this.productService.addProduct(data).subscribe(() => {
        this.refreshProducts();
        toast.success('Product added successfully');
        this.closeDialog();
      });
    }
  }

  confirmDelete(product: ProductDetail) {
    this.deletingProduct.set(product);
    this.deleteDialogOpen.set(true);
  }

  doDelete() {
    const product = this.deletingProduct();
    if (!product) return;
    this.productService.deleteProduct(product.id).subscribe(() => {
      this.refreshProducts();
      toast.success('Product deleted');
      this.deleteDialogOpen.set(false);
      this.deletingProduct.set(null);
    });
  }

  private refreshProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }
}
