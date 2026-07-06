import { Component } from '@angular/core';

@Component({
  selector: 'app-account-cancellations',
  standalone: true,
  template: `
    <div class="border border-gray-200 rounded-lg p-6 sm:p-10">
      <h2 class="text-[#DB4444] text-lg font-medium mb-8">My Cancellations</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 font-medium text-gray-600">Order ID</th>
              <th class="pb-3 font-medium text-gray-600">Product</th>
              <th class="pb-3 font-medium text-gray-600">Date</th>
              <th class="pb-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100">
              <td class="py-4">#ORD-5891</td>
              <td class="py-4">RGB Liquid CPU Cooler</td>
              <td class="py-4 text-gray-500">Mar 12, 2024</td>
              <td class="py-4">
                <span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Cancelled</span>
              </td>
            </tr>
            <tr class="border-b border-gray-100">
              <td class="py-4">#ORD-4217</td>
              <td class="py-4">Small BookShelf</td>
              <td class="py-4 text-gray-500">Apr 8, 2024</td>
              <td class="py-4">
                <span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Cancelled</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AccountCancellationsComponent {}
