import { Component } from '@angular/core';

@Component({
  selector: 'app-account-reviews',
  standalone: true,
  template: `
    <div class="border border-gray-200 rounded-lg p-6 sm:p-10">
      <h2 class="text-[#DB4444] text-lg font-medium mb-8">My Reviews</h2>

      <div class="space-y-6">
        <!-- Review 1 -->
        <div class="border border-gray-100 rounded-lg p-5">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-sm">HAVIT HV-G92 Gamepad</h3>
            <div class="flex gap-0.5">
              @for (star of [1,2,3,4,5]; track star) {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" [class.text-yellow-400]="star <= 4" [class.text-gray-200]="star > 4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              }
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-2">Great product! Works perfectly for gaming.</p>
          <p class="text-xs text-gray-400">Reviewed on Jan 20, 2024</p>
        </div>

        <!-- Review 2 -->
        <div class="border border-gray-100 rounded-lg p-5">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-sm">IPS LCD Gaming Monitor</h3>
            <div class="flex gap-0.5">
              @for (star of [1,2,3,4,5]; track star) {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" [class.text-yellow-400]="star <= 5" [class.text-gray-200]="star > 5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              }
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-2">Excellent display quality and color accuracy.</p>
          <p class="text-xs text-gray-400">Reviewed on Feb 10, 2024</p>
        </div>
      </div>
    </div>
  `,
})
export class AccountReviewsComponent {}
