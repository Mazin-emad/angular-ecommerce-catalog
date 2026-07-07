import { Component, inject, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/logo/logo';
import { Subject, filter, takeUntil } from 'rxjs';

type NavItem = {
  label: string;
  path: string;
  svg: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard', path: '/admin',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />'
  },
  {
    label: 'Products', path: '/admin/products',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />'
  },
  {
    label: 'Orders', path: '/admin/orders',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />'
  },
  {
    label: 'Users', path: '/admin/users',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />'
  },
  {
    label: 'Categories', path: '/admin/categories',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />'
  },
  {
    label: 'Settings', path: '/admin/settings',
    svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />'
  },
];

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Mobile backdrop -->
      @if (sidebarOpen() && isMobileView()) {
        <div class="fixed inset-0 bg-black/40 z-40 lg:hidden" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Sidebar -->
      <aside
        [class.-translate-x-full]="!sidebarOpen() && isMobileView()"
        [class.translate-x-0]="sidebarOpen() || !isMobileView()"
        class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out"
      >
        <div class="h-16 flex items-center px-6 border-b border-gray-200">
          <app-logo size="sm" />
        </div>

        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-[#DB4444]/10 text-[#DB4444] font-medium"
              [routerLinkActiveOptions]="{ exact: item.path === '/admin' }"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              (click)="closeSidebarMobile()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" [innerHTML]="item.svg"></svg>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="border-t border-gray-200 p-4">
          @if (auth.currentUser(); as user) {
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-[#DB4444] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
              </div>
            </div>
          }
        </div>
      </aside>

      <!-- Main area -->
      <div class="flex-1 flex flex-col min-w-0">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div class="flex items-center gap-4">
            <button
              (click)="toggleSidebar()"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle() }}</h1>
          </div>

          <div class="flex items-center gap-3">
            <a routerLink="/" class="text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:inline">Back to Store</a>
            <a routerLink="/" class="text-xs text-gray-500 hover:text-gray-700 transition-colors sm:hidden">Store</a>
            <button (click)="auth.logout()" class="text-sm text-gray-500 hover:text-[#DB4444] transition-colors">Logout</button>
          </div>
        </header>

        <main class="flex-1 p-4 lg:p-6 overflow-x-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayout implements OnInit, OnDestroy {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly navItems = NAV_ITEMS;
  readonly sidebarOpen = signal(false);
  readonly pageTitle = signal('Dashboard');

  private mobileView = signal(false);
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.checkViewport();
  }

  ngOnInit() {
    this.updatePageTitle();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => this.updatePageTitle());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isMobileView() {
    return this.mobileView();
  }

  @HostListener('window:resize')
  checkViewport() {
    this.mobileView.set(window.innerWidth < 1024);
    if (window.innerWidth >= 1024) {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebarMobile() {
    if (this.isMobileView()) {
      this.sidebarOpen.set(false);
    }
  }

  private updatePageTitle() {
    const path = window.location.pathname;
    const item = NAV_ITEMS.find(n =>
      path === n.path || path.startsWith(n.path + '/')
    );
    this.pageTitle.set(item?.label ?? 'Dashboard');
  }
}
