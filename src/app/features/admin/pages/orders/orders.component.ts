import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../../../shared/services/order.service';
import { Order, OrderStatus } from '../../../../shared/models/order.model';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, DialogComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Orders</h2>
        <p class="text-sm text-gray-500 mt-1">{{ filteredOrders().length }} orders</p>
      </div>

      <!-- Search + Filter -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search by order ID or customer..." [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)"
            class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444] transition-colors" />
        </div>
        <select [value]="statusFilter()" (change)="statusFilter.set($any($event.target).value)"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#DB4444]">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left text-gray-500 bg-gray-50">
                <th class="px-4 py-3 font-medium">Order ID</th>
                <th class="px-4 py-3 font-medium">Customer</th>
                <th class="px-4 py-3 font-medium">Date</th>
                <th class="px-4 py-3 font-medium">Items</th>
                <th class="px-4 py-3 font-medium">Total</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of filteredOrders(); track order.id) {
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ order.id }}</td>
                  <td class="px-4 py-3">
                    <p class="text-gray-900">{{ order.userName }}</p>
                    <p class="text-xs text-gray-500">{{ order.userEmail }}</p>
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ order.createdAt | date:'mediumDate' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ order.items.length }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ order.total | currency }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="statusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button (click)="viewOrder(order)"
                      class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">View</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-4 py-10 text-center text-gray-500">No orders found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Order Details Dialog -->
    <app-dialog [open]="orderDialogOpen()" [title]="'Order #' + selectedOrder()?.id" (close)="orderDialogOpen.set(false)">
      @if (selectedOrder(); as order) {
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Customer</p>
              <p class="font-medium text-gray-900">{{ order.userName }}</p>
            </div>
            <div>
              <p class="text-gray-500">Email</p>
              <p class="font-medium text-gray-900">{{ order.userEmail }}</p>
            </div>
            <div>
              <p class="text-gray-500">Date</p>
              <p class="font-medium text-gray-900">{{ order.createdAt | date:'medium' }}</p>
            </div>
            <div>
              <p class="text-gray-500">Payment</p>
              <p class="font-medium text-gray-900">{{ order.paymentMethod }}</p>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Shipping Address</p>
            <p class="text-sm font-medium text-gray-900">{{ order.shippingAddress }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-2">Items</p>
            <div class="space-y-2">
              @for (item of order.items; track item.productId) {
                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <img [src]="item.image" [alt]="item.name" class="w-10 h-10 rounded object-cover bg-gray-200" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.quantity }} x {{ item.price | currency }}</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">{{ item.price * item.quantity | currency }}</p>
                </div>
              }
            </div>
          </div>

          <div class="border-t border-gray-200 pt-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span class="text-gray-900">{{ order.subtotal | currency }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Shipping</span>
              <span class="text-gray-900">{{ order.shipping | currency }}</span>
            </div>
            @if (order.discount) {
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Discount</span>
                <span class="text-green-600">-{{ order.discount | currency }}</span>
              </div>
            }
            <div class="flex justify-between text-sm font-semibold mt-1">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">{{ order.total | currency }}</span>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-2">Update Status</p>
            <div class="flex flex-wrap gap-2">
              @for (s of statuses; track s) {
                <button (click)="updateStatus(order.id, s)" [disabled]="s === order.status"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  [class]="s === order.status ? 'bg-[#DB4444] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                  {{ s }}
                </button>
              }
            </div>
          </div>
        </div>
      }
    </app-dialog>
  `,
})
export class AdminOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal('');

  readonly orderDialogOpen = signal(false);
  readonly selectedOrder = signal<Order | null>(null);

  readonly statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit() {
    this.orderService.getOrders().subscribe(orders => this.orders.set(orders));
  }

  readonly filteredOrders = () => {
    const q = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    return this.orders().filter(o => {
      const matchSearch = !q || o.id.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q);
      const matchStatus = !status || o.status === status;
      return matchSearch && matchStatus;
    });
  };

  viewOrder(order: Order) {
    this.selectedOrder.set(order);
    this.orderDialogOpen.set(true);
  }

  updateStatus(orderId: string, status: OrderStatus) {
    this.orderService.updateOrderStatus(orderId, status).subscribe(updated => {
      this.orders.update(list => list.map(o => o.id === orderId ? updated : o));
      this.selectedOrder.set(updated);
      toast.success(`Order ${orderId} updated to ${status}`);
    });
  }

  statusClass(status: OrderStatus): string {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
    }
  }
}
