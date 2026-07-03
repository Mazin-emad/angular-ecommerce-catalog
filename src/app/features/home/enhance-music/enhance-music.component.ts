import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-enhance-music',
  standalone: true,
  imports: [],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="relative bg-black rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[400px]">
          <div class="relative z-10 p-6 md:p-12 lg:p-16 flex flex-col gap-4 md:gap-6">
            <span class="text-[#00FF66] font-medium text-sm">Categories</span>
            <h2 class="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Enhance Your<br />Music Experience
            </h2>
            <div class="flex items-center gap-3 md:gap-4">
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex flex-col items-center justify-center">
                <span class="text-white text-sm md:text-base font-bold leading-tight">{{ hours() }}</span>
                <span class="text-white text-[8px] md:text-[10px]">Hours</span>
              </div>
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex flex-col items-center justify-center">
                <span class="text-white text-sm md:text-base font-bold leading-tight">{{ days() }}</span>
                <span class="text-white text-[8px] md:text-[10px]">Days</span>
              </div>
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex flex-col items-center justify-center">
                <span class="text-white text-sm md:text-base font-bold leading-tight">{{ minutes() }}</span>
                <span class="text-white text-[8px] md:text-[10px]">Minutes</span>
              </div>
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex flex-col items-center justify-center">
                <span class="text-white text-sm md:text-base font-bold leading-tight">{{ seconds() }}</span>
                <span class="text-white text-[8px] md:text-[10px]">Seconds</span>
              </div>
            </div>
            <button class="bg-[#00FF66] hover:bg-[#00cc55] text-black font-medium py-3 px-8 rounded transition-colors duration-200 w-fit text-sm md:text-base">
              Buy Now!
            </button>
          </div>
          <div class="relative w-full md:w-1/2 flex items-center justify-center p-4 md:p-0">
            <img
              src="images/home/boombox.png"
              alt="JBL Boombox Speaker"
              class="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class EnhanceMusicComponent implements OnInit, OnDestroy {
  readonly hours = signal('03');
  readonly days = signal('23');
  readonly minutes = signal('19');
  readonly seconds = signal('56');

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private targetDate: Date;

  constructor() {
    this.targetDate = new Date();
    this.targetDate.setDate(this.targetDate.getDate() + 23);
    this.targetDate.setHours(this.targetDate.getHours() + 5);
    this.targetDate.setMinutes(this.targetDate.getMinutes() + 59);
    this.targetDate.setSeconds(this.targetDate.getSeconds() + 35);
  }

  ngOnInit(): void {
    this.updateCountdown();
    this.timerInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private updateCountdown(): void {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.days.set('00');
      this.hours.set('00');
      this.minutes.set('00');
      this.seconds.set('00');
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    this.days.set(d.toString().padStart(2, '0'));
    this.hours.set(h.toString().padStart(2, '0'));
    this.minutes.set(m.toString().padStart(2, '0'));
    this.seconds.set(s.toString().padStart(2, '0'));
  }
}
