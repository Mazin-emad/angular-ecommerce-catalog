import { Injectable, signal } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly items = signal<CartItem[]>([]);
  readonly itemCount = signal(0);

  addToCart(item: CartItem): void {
    const currentItems = this.items();
    const existingIndex = currentItems.findIndex(i => i.id === item.id);

    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + item.quantity,
      };
      this.items.set(updated);
    } else {
      this.items.set([...currentItems, item]);
    }
    this.updateItemCount();
  }

  removeFromCart(itemId: string): void {
    this.items.set(this.items().filter(i => i.id !== itemId));
    this.updateItemCount();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const updated = this.items().map(i =>
      i.id === itemId ? { ...i, quantity } : i
    );
    this.items.set(updated);
    this.updateItemCount();
  }

  clearCart(): void {
    this.items.set([]);
    this.updateItemCount();
  }

  private updateItemCount(): void {
    const total = this.items().reduce((sum, item) => sum + item.quantity, 0);
    this.itemCount.set(total);
  }
}
