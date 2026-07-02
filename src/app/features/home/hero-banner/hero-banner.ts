import { Component, OnInit, inject, DestroyRef, signal, input } from '@angular/core';
import { HeroSlideComponent, Slide } from '../hero-slide/hero-slide';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [HeroSlideComponent],
  template: `
    <div class="flex-1 min-w-0 pt-4">
      <div class="relative bg-black rounded-sm overflow-hidden min-h-85">
        <app-hero-slide [slide]="slides()[currentSlide()]" />
      </div>

      <div class="flex justify-center gap-2 mt-4">
        @for (slide of slides(); track $index) {
          <button
            (click)="goToSlide($index)"
            class="w-3 h-3 rounded-full transition-colors"
            [class]="currentSlide() === $index ? 'bg-red-500' : 'bg-gray-300'"
          ></button>
        }
      </div>
    </div>
  `,
})
export class HeroBannerComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly slides = input<Slide[]>([]);
  readonly currentSlide = signal(0);

  ngOnInit(): void {
    this.startTimer();
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.startTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.intervalId = setInterval(() => {
      this.currentSlide.update(n => (n + 1) % this.slides().length);
    }, 3000);
  }

  private clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
