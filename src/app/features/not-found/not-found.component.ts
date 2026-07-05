import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />

      <div class="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 class="text-[80px] md:text-[120px] font-bold leading-none mb-6">404 Not Found</h1>
        <p class="text-gray-600 mb-8">Your visited page not found. You may go home page.</p>
        <a
          routerLink="/"
          class="bg-[#DB4444] hover:bg-[#c53a3a] text-white font-medium py-3 px-8 rounded transition-colors duration-200"
        >
          Back to home page
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: '404 Error' },
  ];
}
