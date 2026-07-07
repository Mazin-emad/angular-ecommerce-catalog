import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../../../shared/services/category.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Categories</h2>
          <p class="text-sm text-gray-500 mt-1">{{ categories().length }} categories</p>
        </div>
        <button (click)="openAddDialog()"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#DB4444] text-white text-sm font-medium rounded-lg hover:bg-[#c23434] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Category
        </button>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left text-gray-500 bg-gray-50">
                <th class="px-4 py-3 font-medium">Name</th>
                <th class="px-4 py-3 font-medium">Slug</th>
                <th class="px-4 py-3 font-medium">Products</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of categories(); track cat.id) {
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ cat.name }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ cat.slug }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ cat.productCount }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="openEditDialog(cat)"
                        class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-600" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button (click)="confirmDelete(cat)"
                        class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-600" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-4 py-10 text-center text-gray-500">No categories yet</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <app-dialog [open]="dialogOpen()" [title]="editingCategory() ? 'Edit Category' : 'Add Category'" (close)="closeDialog()">
      <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" formControlName="name" placeholder="e.g. Electronics"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" formControlName="slug" placeholder="e.g. electronics"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]" />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" (click)="closeDialog()" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
          <button type="submit" [disabled]="categoryForm.invalid"
            class="px-4 py-2 bg-[#DB4444] text-white text-sm font-medium rounded-lg hover:bg-[#c23434] disabled:opacity-50 transition-colors">
            {{ editingCategory() ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </app-dialog>

    <!-- Delete Confirmation -->
    <app-dialog [open]="deleteDialogOpen()" title="Delete Category" (close)="deleteDialogOpen.set(false)">
      @if (deletingCategory(); as cat) {
        <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{{ cat.name }}</strong>?</p>
        <div class="flex justify-end gap-3">
          <button (click)="deleteDialogOpen.set(false)" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
          <button (click)="doDelete()" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Delete</button>
        </div>
      }
    </app-dialog>
  `,
})
export class AdminCategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<Category[]>([]);
  readonly dialogOpen = signal(false);
  readonly deleteDialogOpen = signal(false);
  readonly editingCategory = signal<Category | null>(null);
  readonly deletingCategory = signal<Category | null>(null);

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  openAddDialog() {
    this.editingCategory.set(null);
    this.categoryForm.reset({ name: '', slug: '' });
    this.dialogOpen.set(true);
  }

  openEditDialog(cat: Category) {
    this.editingCategory.set(cat);
    this.categoryForm.setValue({ name: cat.name, slug: cat.slug });
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
    this.editingCategory.set(null);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    const { name, slug } = this.categoryForm.value;
    const edit = this.editingCategory();
    if (edit) {
      this.categoryService.updateCategory(edit.id, { name, slug }).subscribe(updated => {
        this.categories.update(list => list.map(c => c.id === updated.id ? updated : c));
        toast.success('Category updated');
        this.closeDialog();
      });
    } else {
      this.categoryService.addCategory(name!, slug!).subscribe(newCat => {
        this.categories.update(list => [...list, newCat]);
        toast.success('Category added');
        this.closeDialog();
      });
    }
  }

  confirmDelete(cat: Category) {
    this.deletingCategory.set(cat);
    this.deleteDialogOpen.set(true);
  }

  doDelete() {
    const cat = this.deletingCategory();
    if (!cat) return;
    this.categoryService.deleteCategory(cat.id).subscribe(() => {
      this.categories.update(list => list.filter(c => c.id !== cat.id));
      toast.success('Category deleted');
      this.deleteDialogOpen.set(false);
      this.deletingCategory.set(null);
    });
  }
}
