// nav-bar.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../../../shared/logo/logo';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, LogoComponent],
  templateUrl: './header.html',
})
export class Header {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  searchQuery = '';
  menuOpen = false;

  get wishlistCount(): number {
    return this.wishlistService.itemCount();
  }

  get cartCount(): number {
    return this.cartService.itemCount();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    console.log('Searching for:', this.searchQuery);
  }
}
