import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
        <p class="text-sm text-gray-500 mt-1">Application settings and configuration</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-3.84 3.84m3.84-3.84l-3.84 3.84m0 0a2.25 2.25 0 00-3.18 0l-.18.18a2.25 2.25 0 003.18 3.18l.18-.18m3.84-3.84l3.84 3.84m-3.84-3.84l3.84 3.84m0 0a2.25 2.25 0 003.18 3.18l.18-.18a2.25 2.25 0 00-3.18-3.18l-.18.18m3.84-3.84l-.18-.18a2.25 2.25 0 013.18-3.18l.18.18m-3.18 3.18l3.84-3.84m-3.84 3.84l3.84-3.84M9 6.75V3.75m0 3v3m6-6V3.75m0 3v3m-6 7.5V21m0-3v-3" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
        <p class="text-sm text-gray-500 max-w-md mx-auto">
          This section is reserved for application configuration such as store information, payment gateways, shipping settings, email templates, and more.
        </p>
      </div>
    </div>
  `,
})
export class AdminSettingsComponent {}
