import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics', productCount: 8 },
  { id: 'cat-2', name: 'Clothing', slug: 'clothing', productCount: 3 },
  { id: 'cat-3', name: 'Home & Garden', slug: 'home-garden', productCount: 0 },
  { id: 'cat-4', name: 'Sports', slug: 'sports', productCount: 0 },
  { id: 'cat-5', name: 'Books', slug: 'books', productCount: 0 },
  { id: 'cat-6', name: 'Toys', slug: 'toys', productCount: 3 },
  { id: 'cat-7', name: 'Music', slug: 'music', productCount: 0 },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly categoriesSignal = signal<Category[]>(MOCK_CATEGORIES);

  readonly categories = this.categoriesSignal.asReadonly();

  getCategories(): Observable<Category[]> {
    return of([...this.categoriesSignal()]).pipe(delay(200));
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return of(this.categoriesSignal().find(c => c.id === id)).pipe(delay(150));
  }

  addCategory(name: string, slug: string): Observable<Category> {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      productCount: 0,
    };
    this.categoriesSignal.update(list => [...list, newCat]);
    return of(newCat).pipe(delay(300));
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    let updated!: Category;
    this.categoriesSignal.update(list =>
      list.map(c => {
        if (c.id === id) {
          updated = { ...c, ...data };
          return updated;
        }
        return c;
      })
    );
    return of(updated).pipe(delay(300));
  }

  deleteCategory(id: string): Observable<boolean> {
    this.categoriesSignal.update(list => list.filter(c => c.id !== id));
    return of(true).pipe(delay(300));
  }
}
