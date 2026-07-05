import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-12">
      @for (item of items(); track item.label; let last = $last) {
        @if (item.link) {
          <a [routerLink]="item.link" class="hover:text-gray-900 transition-colors">{{ item.label }}</a>
        } @else {
          <span class="text-gray-900">{{ item.label }}</span>
        }
        @if (!last) {
          <span>/</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  items = input.required<BreadcrumbItem[]>();
}
