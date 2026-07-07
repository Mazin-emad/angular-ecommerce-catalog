import {
  Component,
  inject,
  signal,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="relative"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
    >
      <button
        (click)="toggleMenu($event)"
        class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="true"
        aria-label="User menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </button>

      <!-- Backdrop for closing (mobile) -->
      @if (isOpen()) {
        <div class="fixed inset-0 z-40 md:hidden" (click)="closeMenu()"></div>
      }

      <!-- Dropdown menu -->
      <div
        class="absolute right-0 top-full mt-2 z-50 w-60 origin-top-right transition-all duration-200 ease-out"
        [class]="isOpen()
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
      >
        @if (authService.isAuthenticated()) {
          <div
            class="rounded-xl overflow-hidden shadow-2xl border border-white/10"
            style="background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(50,50,50,0.90) 100%); backdrop-filter: blur(16px);"
          >
            <div class="py-2">
              <!-- Manage My Account -->
              <a routerLink="/account" (click)="closeMenu()"
                class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Manage My Account</span>
              </a>

              <!-- My Orders -->
              <a routerLink="/account" [queryParams]="{ tab: 'returns' }" (click)="closeMenu()"
                class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span>My Orders</span>
              </a>

              <!-- My Cancellations -->
              <a routerLink="/account" [queryParams]="{ tab: 'cancellations' }" (click)="closeMenu()"
                class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>My Cancellations</span>
              </a>

              <!-- My Reviews -->
              <a routerLink="/account" [queryParams]="{ tab: 'reviews' }" (click)="closeMenu()"
                class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span>My Reviews</span>
              </a>

              @if (authService.isAdmin()) {
                <!-- Dashboard (Admin only) -->
                <a routerLink="/admin" (click)="closeMenu()"
                  class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              }

              <!-- Divider -->
              <div class="mx-4 border-t border-white/10"></div>

              <!-- Logout -->
              <button (click)="onLogout()"
                class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        } @else {
          <!-- Not authenticated: show login prompt -->
          <div
            class="rounded-xl overflow-hidden shadow-2xl border border-white/10"
            style="background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(50,50,50,0.90) 100%); backdrop-filter: blur(16px);"
          >
            <div class="py-2">
              <a routerLink="/login" (click)="closeMenu()"
                class="flex items-center gap-4 px-5 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Login / Sign Up</span>
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  host: {
    class: 'inline-flex items-center',
  },
})
export class UserMenuComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly el = inject(ElementRef);

  readonly isOpen = signal(false);
  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  private isDesktop = false;

  ngOnInit() {
    this.checkDesktop();
    window.addEventListener('resize', this.checkDesktop.bind(this));
  }

  private checkDesktop() {
    this.isDesktop = window.innerWidth >= 768;
  }

  onMouseEnter() {
    if (!this.isDesktop) return;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.isOpen.set(true);
  }

  onMouseLeave() {
    if (!this.isDesktop) return;
    this.hoverTimeout = setTimeout(() => this.isOpen.set(false), 100);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      this.isOpen.set(true);
    }
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  onLogout() {
    this.closeMenu();
    this.authService.logout();
    toast.success('Logged out successfully');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isOpen.set(false);
  }
}
