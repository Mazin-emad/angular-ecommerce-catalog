import { Component } from '@angular/core';

@Component({
  selector: 'app-account-returns',
  standalone: true,
  template: `
    <div class="border border-gray-200 rounded-lg p-6 sm:p-10">
      <h2 class="text-[#DB4444] text-lg font-medium mb-8">My Returns</h2>

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
              <td class="py-4">#ORD-7352</td>
              <td class="py-4">HAVIT HV-G92 Gamepad</td>
              <td class="py-4 text-gray-500">Jan 15, 2024</td>
              <td class="py-4">
                <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Approved</span>
              </td>
            </tr>
            <tr class="border-b border-gray-100">
              <td class="py-4">#ORD-6128</td>
              <td class="py-4">IPS LCD Gaming Monitor</td>
              <td class="py-4 text-gray-500">Feb 3, 2024</td>
              <td class="py-4">
                <span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AccountReturnsComponent {}
