import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  heroShoppingBag,
  heroComputerDesktop,
  heroHome,
  heroBeaker,
  heroTrophy,
  heroFaceSmile,
  heroShoppingCart,
  heroSparkles,
} from '@ng-icons/heroicons/outline';

export interface Category {
  name: string;
  hasArrow?: boolean;
  icon?: string;
}

const ICON_MAP: Record<string, string> = {
  womens: heroShoppingBag,
  mens: heroShoppingBag,
  electronics: heroComputerDesktop,
  home: heroHome,
  medicine: heroBeaker,
  sports: heroTrophy,
  babies: heroFaceSmile,
  groceries: heroShoppingCart,
  health: heroSparkles,
};

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgIcon],
  template: `
    <aside
      class="shrink-0 md:w-52 border-b md:border-r md:border-t md:border-b border-gray-200 pt-3 md:pt-4 pb-3 md:pb-4"
    >
      <ul
        class="flex flex-row md:flex-col gap-3 md:gap-4 text-sm overflow-x-auto md:overflow-visible pb-1 md:pb-0"
        style="scrollbar-width: none;"
      >
        @for (cat of categories; track cat.name) {
          <li class="shrink-0">
            <a
              href="#"
              class="flex items-center justify-between gap-2 text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              <div class="flex items-center gap-2 md:gap-3">
                @if (cat.icon) {
                  <ng-icon [svg]="getIcon(cat.icon)" class="w-12 h-12 text-gray-600" />
                }
                <span>{{ cat.name }}</span>
              </div>
              @if (cat.hasArrow) {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              }
            </a>
          </li>
        }
      </ul>
    </aside>
  `,
})
export class CategoriesComponent {
  @Input({ required: true }) categories: Category[] = [];

  getIcon(key: string): string {
    return ICON_MAP[key] || heroShoppingBag;
  }
}
