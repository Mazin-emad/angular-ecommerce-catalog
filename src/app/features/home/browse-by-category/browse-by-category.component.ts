import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import {
  heroDevicePhoneMobile,
  heroComputerDesktop,
  heroClock,
  heroCamera,
  heroSpeakerWave,
  heroPuzzlePiece,
} from '@ng-icons/heroicons/outline';

interface Category {
  id: string;
  name: string;
  route: string;
}

const ICON_MAP: Record<string, string> = {
  phones: heroDevicePhoneMobile,
  computers: heroComputerDesktop,
  smartwatch: heroClock,
  camera: heroCamera,
  headphones: heroSpeakerWave,
  gaming: heroPuzzlePiece,
};

@Component({
  selector: 'app-browse-by-category',
  standalone: true,
  imports: [RouterLink, NgIcon],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
          <span class="text-[#DB4444] font-semibold text-base">Categories</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <h2 class="text-3xl md:text-4xl font-semibold">Browse By Category</h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          @for (category of categories; track category.id) {
            <a
              [routerLink]="category.route"
              (click)="selectCategory(category.id)"
              class="aspect-square border rounded-lg flex flex-col items-center justify-center gap-3 md:gap-4 cursor-pointer transition-all duration-200"
              [class]="selectedCategory() === category.id ? 'border-[#DB4444] bg-[#DB4444] text-white' : 'border-gray-200 bg-white hover:border-[#DB4444]'"
            >
              <ng-icon [svg]="getIcon(category.id)" class="w-10 h-10 md:w-14 md:h-14" />
              <span class="font-medium text-xs md:text-base text-center">{{ category.name }}</span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class BrowseByCategoryComponent {
  readonly selectedCategory = signal<string>('camera');

  readonly categories: Category[] = [
    { id: 'phones', name: 'Phones', route: '/products?category=phones' },
    { id: 'computers', name: 'Computers', route: '/products?category=computers' },
    { id: 'smartwatch', name: 'SmartWatch', route: '/products?category=smartwatch' },
    { id: 'camera', name: 'Camera', route: '/products?category=camera' },
    { id: 'headphones', name: 'HeadPhones', route: '/products?category=headphones' },
    { id: 'gaming', name: 'Gaming', route: '/products?category=gaming' },
  ];

  getIcon(id: string): string {
    return ICON_MAP[id] || heroDevicePhoneMobile;
  }

  selectCategory(id: string): void {
    this.selectedCategory.set(id);
  }
}
