import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { AccountProfileComponent } from './account-profile.component';
import { AccountAddressComponent } from './account-address.component';
import { AccountPaymentComponent } from './account-payment.component';
import { AccountReturnsComponent } from './account-returns.component';
import { AccountCancellationsComponent } from './account-cancellations.component';
import { AccountReviewsComponent } from './account-reviews.component';

export type AccountTab = 'profile' | 'address' | 'payment' | 'returns' | 'cancellations' | 'reviews';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    RouterLink,
    BreadcrumbComponent,
    AccountProfileComponent,
    AccountAddressComponent,
    AccountPaymentComponent,
    AccountReturnsComponent,
    AccountCancellationsComponent,
    AccountReviewsComponent,
  ],
  template: `
    <div class="py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 lg:mb-12">
        <app-breadcrumb [items]="breadcrumbs" />
        @if (authService.currentUser(); as user) {
          <p class="text-sm text-gray-600">
            Welcome! <span class="text-[#DB4444] font-medium">{{ user.name }}</span>
          </p>
        }
      </div>

      <!-- Mobile nav toggle -->
      <button
        (click)="mobileNavOpen.set(!mobileNavOpen())"
        class="flex lg:hidden items-center justify-between w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{{ activeTabLabel() }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 transition-transform"
          [class.rotate-180]="mobileNavOpen()"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
        <!-- Sidebar - collapsible on mobile -->
        <aside [class.hidden]="!mobileNavOpen()" class="lg:block">
          <!-- Manage My Account -->
          <div class="mb-6 lg:mb-8">
            <h3 class="text-base font-semibold mb-3 lg:mb-4">Manage My Account</h3>
            <nav class="space-y-2 lg:space-y-3 pl-1">
              <button
                (click)="switchTab('profile')"
                class="block w-full text-left text-sm transition-colors"
                [class]="activeTab() === 'profile' ? 'text-[#DB4444] font-medium' : 'text-gray-500 hover:text-gray-800'"
              >
                My Profile
              </button>
              <button
                (click)="switchTab('address')"
                class="block w-full text-left text-sm transition-colors"
                [class]="activeTab() === 'address' ? 'text-[#DB4444] font-medium' : 'text-gray-500 hover:text-gray-800'"
              >
                Address Book
              </button>
              <button
                (click)="switchTab('payment')"
                class="block w-full text-left text-sm transition-colors"
                [class]="activeTab() === 'payment' ? 'text-[#DB4444] font-medium' : 'text-gray-500 hover:text-gray-800'"
              >
                My Payment Options
              </button>
            </nav>
          </div>

          <!-- My Orders -->
          <div class="mb-6 lg:mb-8">
            <h3 class="text-base font-semibold mb-3 lg:mb-4">My Orders</h3>
            <nav class="space-y-2 lg:space-y-3 pl-1">
              <button
                (click)="switchTab('returns')"
                class="block w-full text-left text-sm transition-colors"
                [class]="activeTab() === 'returns' ? 'text-[#DB4444] font-medium' : 'text-gray-500 hover:text-gray-800'"
              >
                My Returns
              </button>
              <button
                (click)="switchTab('cancellations')"
                class="block w-full text-left text-sm transition-colors"
                [class]="activeTab() === 'cancellations' ? 'text-[#DB4444] font-medium' : 'text-gray-500 hover:text-gray-800'"
              >
                My Cancellations
              </button>
            </nav>
          </div>

          <!-- My Reviews -->
          <div class="mb-6 lg:mb-8">
            <h3 class="text-base font-semibold mb-3 lg:mb-4">
              <button (click)="switchTab('reviews')" class="hover:text-[#DB4444] transition-colors text-left">My Reviews</button>
            </h3>
          </div>

          <!-- My WishList -->
          <div>
            <h3 class="text-base font-semibold mb-3 lg:mb-4">
              <a routerLink="/wishlist" class="hover:text-[#DB4444] transition-colors">My WishList</a>
            </h3>
          </div>
        </aside>

        <!-- Content -->
        <div>
          @switch (activeTab()) {
            @case ('profile') {
              <app-account-profile />
            }
            @case ('address') {
              <app-account-address />
            }
            @case ('payment') {
              <app-account-payment />
            }
            @case ('returns') {
              <app-account-returns />
            }
            @case ('cancellations') {
              <app-account-cancellations />
            }
            @case ('reviews') {
              <app-account-reviews />
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'My Account' },
  ];

  readonly activeTab = signal<AccountTab>('profile');
  readonly mobileNavOpen = signal(false);

  readonly activeTabLabel = signal('My Profile');

  private readonly tabLabels: Record<AccountTab, string> = {
    profile: 'My Profile',
    address: 'Address Book',
    payment: 'My Payment Options',
    returns: 'My Returns',
    cancellations: 'My Cancellations',
    reviews: 'My Reviews',
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] as AccountTab | undefined;
      if (tab && this.tabLabels[tab]) {
        this.switchTab(tab);
      }
    });
  }

  switchTab(tab: AccountTab): void {
    this.activeTab.set(tab);
    this.activeTabLabel.set(this.tabLabels[tab]);
    this.mobileNavOpen.set(false);
  }
}
