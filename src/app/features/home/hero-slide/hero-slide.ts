import { Component, Input, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { simpleApple, simplePlaystation } from '@ng-icons/simple-icons';

export interface Slide {
  badge: string;
  heading: string;
  cta: string;
  image: string;
  icon: 'apple' | 'playstation' | 'gucci';
}

@Component({
  selector: 'app-hero-slide',
  standalone: true,
  imports: [NgIcon],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 min-h-[280px] md:min-h-[340px]">
      <div class="relative z-10 flex flex-col justify-center px-6 md:px-12 py-6 md:py-10">
        <div class="flex items-center gap-3 mb-4 md:mb-6">
          @if (slide.icon === 'apple') {
            <ng-icon [svg]="appleSvg" size="2rem" color="#ffffff" />
          } @else if (slide.icon === 'playstation') {
            <ng-icon [svg]="playstationSvg" size="2rem" color="#003791" />
          } @else {
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="#E50010">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          }
          <span class="text-white text-sm md:text-base font-medium">{{ slide.badge }}</span>
        </div>

        <h1 class="text-white text-xl md:text-5xl font-semibold leading-tight mb-4 md:mb-8">
          {{ slide.heading }}
        </h1>

        <a href="#" class="hidden md:inline-flex items-center gap-2 text-white text-sm md:text-base font-medium border-b-2 border-white w-fit pb-1 hover:opacity-80 transition-opacity">
          {{ slide.cta }}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        <div class="md:hidden">
          <button
            (click)="toggleCta()"
            class="flex items-center gap-2 text-white/80 text-sm font-medium hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 transition-transform duration-200"
              [class.-rotate-180]="ctaVisible()"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          @if (ctaVisible()) {
            <a
              href="#"
              class="inline-flex items-center gap-2 text-white text-sm font-medium border-b-2 border-white w-fit pb-1 mt-2 hover:opacity-80 transition-opacity"
            >
              {{ slide.cta }}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          }
        </div>
      </div>

      <div class="flex items-center justify-center p-4 md:p-8">
        <img
          [src]="slide.image"
          [alt]="slide.badge"
          class="max-h-20 md:max-h-72 w-auto object-contain drop-shadow-2xl transition-opacity duration-300"
        />
      </div>
    </div>
  `,
})
export class HeroSlideComponent {
  @Input({ required: true }) slide!: Slide;

  readonly appleSvg = simpleApple;
  readonly playstationSvg = simplePlaystation;

  readonly ctaVisible = signal(false);

  toggleCta(): void {
    this.ctaVisible.update(v => !v);
  }
}
