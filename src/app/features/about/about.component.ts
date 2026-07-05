import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { OurStoryComponent } from './our-story/our-story.component';
import { TeamSectionComponent } from './team-section/team-section.component';
import { ServicesComponent } from '../../shared/components/services/services.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { heroBuildingStorefront, heroCurrencyDollar, heroShoppingBag, heroBanknotes } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    OurStoryComponent,
    TeamSectionComponent,
    ServicesComponent,
    StatCardComponent,
  ],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />
      <app-our-story />

      <section class="py-12 md:py-16">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          @for (stat of stats; track stat.value) {
            <app-stat-card
              [icon]="stat.icon"
              [value]="stat.value"
              [label]="stat.label"
            />
          }
        </div>
      </section>

      <app-team-section />
      <app-services />
    </div>
  `,
})
export class AboutComponent {
  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'About' },
  ];

  readonly stats = [
    { icon: heroBuildingStorefront, value: '10.5k', label: 'Sellers active our site' },
    { icon: heroCurrencyDollar, value: '33k', label: 'Monthly Product Sale' },
    { icon: heroShoppingBag, value: '45.5k', label: 'Customer active in our site' },
    { icon: heroBanknotes, value: '25k', label: 'Annual gross sale in our site' },
  ];
}
