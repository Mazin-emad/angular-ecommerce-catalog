import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../shared/services/order.service';
import { ProductService } from '../../../../shared/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Order, OrderStatus } from '../../../../shared/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p class="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Products</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalProducts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Orders</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Revenue</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalRevenue | currency }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900">Recent Orders</h3>
          <a routerLink="/admin/orders" class="text-sm text-[#DB4444] hover:underline">View All</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left text-gray-500">
                <th class="px-6 py-3 font-medium">Order</th>
                <th class="px-6 py-3 font-medium">Customer</th>
                <th class="px-6 py-3 font-medium">Date</th>
                <th class="px-6 py-3 font-medium">Total</th>
                <th class="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (order of recentOrders(); track order.id) {
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-3 font-medium text-gray-900">{{ order.id }}</td>
                  <td class="px-6 py-3 text-gray-600">{{ order.userName }}</td>
                  <td class="px-6 py-3 text-gray-500">{{ order.createdAt | date:'mediumDate' }}</td>
                  <td class="px-6 py-3 text-gray-900">{{ order.total | currency }}</td>
                  <td class="px-6 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="statusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center text-gray-500">No orders yet</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);

  readonly recentOrders = signal<Order[]>([]);

  get totalProducts() { return this.productService.totalProducts; }
  get totalOrders() { return this.orderService.totalOrders(); }
  get totalRevenue() { return this.orderService.totalRevenue(); }
  get totalUsers() { return this.authService.getAllUsers().length; }

  ngOnInit() {
    this.orderService.getRecentOrders(5).subscribe(orders => {
      this.recentOrders.set(orders);
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
