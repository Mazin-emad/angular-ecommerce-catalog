import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Order, OrderStatus, OrderItem } from '../models/order.model';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001', userId: '1', userName: 'John Doe', userEmail: 'john@example.com',
    items: [{ productId: '1', name: 'HAVIT HV-G92 Gamepad', price: 120, quantity: 2, image: 'products/gamepad.webp' }],
    subtotal: 240, shipping: 0, discount: 0, total: 240,
    status: 'Delivered', shippingAddress: 'Kingston, 5236, United State', paymentMethod: 'Cash on Delivery',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: 'ORD-002', userId: '2', userName: 'Jane Smith', userEmail: 'jane@example.com',
    items: [
      { productId: '2', name: 'AK-900 Wired Keyboard', price: 960, quantity: 1, image: 'products/keyboard.webp' },
      { productId: '3', name: 'IPS LCD Gaming Monitor', price: 370, quantity: 1, image: 'products/monitor.webp' },
    ],
    subtotal: 1330, shipping: 0, discount: 100, total: 1230,
    status: 'Processing', shippingAddress: '4120 Maple Avenue, Brooklyn, 11201, United States', paymentMethod: 'Bank Transfer',
    createdAt: new Date('2024-07-20'),
  },
  {
    id: 'ORD-003', userId: '1', userName: 'John Doe', userEmail: 'john@example.com',
    items: [{ productId: '4', name: 'S-Series Comfort Chair', price: 375, quantity: 1, image: 'products/chair.webp' }],
    subtotal: 375, shipping: 40, discount: 0, total: 415,
    status: 'Shipped', shippingAddress: 'Kingston, 5236, United State', paymentMethod: 'Cash on Delivery',
    createdAt: new Date('2024-08-05'),
  },
  {
    id: 'ORD-004', userId: '2', userName: 'Jane Smith', userEmail: 'jane@example.com',
    items: [{ productId: '5', name: 'ASUS FHD Gaming Laptop', price: 700, quantity: 1, image: 'products/laptop.webp' }],
    subtotal: 700, shipping: 0, discount: 0, total: 700,
    status: 'Pending', shippingAddress: '4120 Maple Avenue, Brooklyn, 11201, United States', paymentMethod: 'Bank Transfer',
    createdAt: new Date('2024-08-10'),
  },
  {
    id: 'ORD-005', userId: '1', userName: 'John Doe', userEmail: 'john@example.com',
    items: [
      { productId: '6', name: 'RGB liquid CPU Cooler', price: 160, quantity: 1, image: 'products/cooler.webp' },
      { productId: '7', name: 'GP11 Shooter USB Gamepad', price: 660, quantity: 1, image: 'products/usb-gamepad.webp' },
    ],
    subtotal: 820, shipping: 40, discount: 50, total: 810,
    status: 'Cancelled', shippingAddress: 'Kingston, 5236, United State', paymentMethod: 'Cash on Delivery',
    createdAt: new Date('2024-08-01'),
  },
  {
    id: 'ORD-006', userId: '3', userName: 'Admin User', userEmail: 'admin@example.com',
    items: [{ productId: '8', name: 'Quilted Satin Jacket', price: 660, quantity: 1, image: 'products/jacket.webp' }],
    subtotal: 660, shipping: 0, discount: 0, total: 660,
    status: 'Delivered', shippingAddress: 'Admin Office, Downtown, United State', paymentMethod: 'Credit Card',
    createdAt: new Date('2024-07-25'),
  },
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly ordersSignal = signal<Order[]>(MOCK_ORDERS);

  readonly orders = this.ordersSignal.asReadonly();

  readonly totalOrders = computed(() => this.ordersSignal().length);
  readonly totalRevenue = computed(() =>
    this.ordersSignal()
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0)
  );

  getOrders(): Observable<Order[]> {
    return of([...this.ordersSignal()]).pipe(delay(300));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this.ordersSignal().find(o => o.id === id);
    return of(order).pipe(delay(200));
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    const updated = this.ordersSignal().map(o =>
      o.id === orderId ? { ...o, status } : o
    );
    this.ordersSignal.set(updated);
    return of(updated.find(o => o.id === orderId)!).pipe(delay(300));
  }

  getRecentOrders(limit = 5): Observable<Order[]> {
    const sorted = [...this.ordersSignal()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    return of(sorted.slice(0, limit)).pipe(delay(200));
  }
}
