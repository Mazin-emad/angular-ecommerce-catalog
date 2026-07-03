import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-arrival',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-5 h-10 bg-[#DB4444] rounded"></div>
          <span class="text-[#DB4444] font-semibold text-base">Featured</span>
        </div>

        <h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 md:mb-12">New Arrival</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div class="relative bg-black rounded-lg overflow-hidden min-h-[300px] md:min-h-[600px] flex flex-col justify-end p-6 md:p-8">
            <img
              src="images/home/New Arrival-PlayStation 5.png"
              alt="PlayStation 5"
              class="absolute inset-0 w-full h-full object-contain p-8 md:p-12"
            />
            <div class="relative z-10">
              <h3 class="text-white text-xl md:text-2xl font-semibold mb-2">PlayStation 5</h3>
              <p class="text-gray-300 text-sm md:text-base mb-4 max-w-xs">Black and White version of the PS5 coming out on sale.</p>
              <a routerLink="/products" class="text-white text-sm md:text-base font-medium border-b border-white pb-0.5 hover:opacity-80 transition-opacity">
                Shop Now
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:gap-6">
            <div class="relative bg-black rounded-lg overflow-hidden min-h-[200px] md:min-h-[290px] flex flex-col justify-end p-6 md:p-8">
              <img
                src="images/home/New Arrival-Women's Collections.png"
                alt="Women's Collections"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="relative z-10">
                <h3 class="text-white text-lg md:text-xl font-semibold mb-2">Women's Collections</h3>
                <p class="text-gray-300 text-sm md:text-base mb-4 max-w-xs">Featured woman collections that give you another vibe.</p>
                <a routerLink="/products" class="text-white text-sm md:text-base font-medium border-b border-white pb-0.5 hover:opacity-80 transition-opacity">
                  Shop Now
                </a>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 md:gap-6">
              <div class="relative bg-black rounded-lg overflow-hidden min-h-[200px] md:min-h-[290px] flex flex-col justify-end p-4 md:p-6">
                <img
                  src="images/home/New Arrival-Speakers.png"
                  alt="Speakers"
                  class="absolute inset-0 w-full h-full object-contain p-6"
                />
                <div class="relative z-10">
                  <h3 class="text-white text-base md:text-lg font-semibold mb-1">Speakers</h3>
                  <p class="text-gray-300 text-xs md:text-sm mb-3">Amazon wireless speakers</p>
                  <a routerLink="/products" class="text-white text-sm font-medium border-b border-white pb-0.5 hover:opacity-80 transition-opacity">
                    Shop Now
                  </a>
                </div>
              </div>

              <div class="relative bg-black rounded-lg overflow-hidden min-h-[200px] md:min-h-[290px] flex flex-col justify-end p-4 md:p-6">
                <img
                  src="images/home/gocci-perfum.png"
                  alt="Perfume"
                  class="absolute inset-0 w-full h-full object-contain p-6"
                />
                <div class="relative z-10">
                  <h3 class="text-white text-base md:text-lg font-semibold mb-1">Perfume</h3>
                  <p class="text-gray-300 text-xs md:text-sm mb-3">GUCCI INTENSE OUD EDP</p>
                  <a routerLink="/products" class="text-white text-sm font-medium border-b border-white pb-0.5 hover:opacity-80 transition-opacity">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NewArrivalComponent {}
