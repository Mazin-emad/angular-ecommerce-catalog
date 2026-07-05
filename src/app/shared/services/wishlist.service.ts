import { Injectable, signal } from '@angular/core';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  readonly items = signal<WishlistItem[]>([
    {
      id: '8',
      name: 'Gucci duffle bag',
      price: 960,
      originalPrice: 1160,
      discount: 35,
      image: 'images/products/Light-Gucci-Savoy-medium-duffle-bag 1.webp',
    },
    {
      id: '5',
      name: 'RGB liquid CPU Cooler',
      price: 1960,
      originalPrice: 1960,
      discount: 0,
      image: 'images/products/RGB liquid CPU Cooler.webp',
    },
    {
      id: '17',
      name: 'GP11 Shooter USB Gamepad',
      price: 550,
      originalPrice: 550,
      discount: 0,
      image: 'images/products/GP11 Shooter USB Gamepad.webp',
    },
    {
      id: '18',
      name: 'Quilted Satin Jacket',
      price: 750,
      originalPrice: 750,
      discount: 0,
      image: 'images/products/Quilted Satin Jacket.webp',
    },
  ]);

  readonly itemCount = signal(4);

  readonly justForYou = signal([
    {
      id: '13',
      name: 'ASUS FHD Gaming Laptop',
      price: 960,
      originalPrice: 1160,
      discount: 35,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/ASUS FHD Gaming Laptop.webp',
    },
    {
      id: '3',
      name: 'IPS LCD Gaming Monitor',
      price: 1160,
      originalPrice: 1160,
      discount: 0,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/IPS LCD Gaming Monitor.webp',
    },
    {
      id: '1',
      name: 'HAVIT HV-G92 Gamepad',
      price: 560,
      originalPrice: 560,
      discount: 0,
      rating: 5,
      reviewCount: 65,
      isNew: true,
      image: 'images/products/HAVIT HV-G92 Gamepad.webp',
    },
    {
      id: '2',
      name: 'AK-900 Wired Keyboard',
      price: 200,
      originalPrice: 200,
      discount: 0,
      rating: 5,
      reviewCount: 65,
      image: 'images/products/AK-900 Wired Keyboard.webp',
    },
  ]);

  addToWishlist(item: WishlistItem): void {
    const current = this.items();
    if (current.some(i => i.id === item.id)) return;
    this.items.set([...current, item]);
    this.updateCount();
  }

  removeFromWishlist(itemId: string): void {
    this.items.set(this.items().filter(i => i.id !== itemId));
    this.updateCount();
  }

  clearWishlist(): void {
    this.items.set([]);
    this.updateCount();
  }

  private updateCount(): void {
    this.itemCount.set(this.items().length);
  }
}
