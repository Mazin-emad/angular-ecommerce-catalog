import { Injectable, signal, computed } from '@angular/core';

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
  readonly items = signal<CartItem[]>([
    {
      id: '3',
      name: 'IPS LCD Gaming Monitor',
      price: 650,
      image: 'images/products/IPS LCD Gaming Monitor.webp',
      quantity: 1,
    },
    {
      id: '1',
      name: 'HAVIT HV-G92 Gamepad',
      price: 550,
      image: 'images/products/HAVIT HV-G92 Gamepad.webp',
      quantity: 2,
    },
  ]);

  readonly couponCode = signal('');
  readonly discountPercent = signal(0);

  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly shipping = computed(() => (this.subtotal() >= 140 ? 0 : 10));

  readonly discount = computed(() =>
    Math.round(this.subtotal() * this.discountPercent() / 100)
  );

  readonly total = computed(() =>
    this.subtotal() + this.shipping() - this.discount()
  );

  readonly validCoupons: Record<string, number> = {
    SAVE10: 10,
    SAVE20: 20,
    HALF: 50,
  };

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
  }

  removeFromCart(itemId: string): void {
    this.items.set(this.items().filter(i => i.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) return;
    const updated = this.items().map(i =>
      i.id === itemId ? { ...i, quantity } : i
    );
    this.items.set(updated);
  }

  applyCoupon(code: string): boolean {
    const upperCode = code.toUpperCase().trim();
    if (this.validCoupons[upperCode] !== undefined) {
      this.discountPercent.set(this.validCoupons[upperCode]);
      this.couponCode.set(upperCode);
      return true;
    }
    return false;
  }

  removeCoupon(): void {
    this.discountPercent.set(0);
    this.couponCode.set('');
  }

  clearCart(): void {
    this.items.set([]);
    this.discountPercent.set(0);
    this.couponCode.set('');
  }
}
