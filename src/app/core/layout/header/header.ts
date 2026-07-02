// nav-bar.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../../../shared/logo/logo';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, LogoComponent],
  templateUrl: './header.html',
})
export class Header {
  searchQuery = '';
  wishlistCount = 0;
  cartCount = 0;
  menuOpen = false;

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
