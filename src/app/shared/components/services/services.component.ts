import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { heroTruck, heroClock, heroShieldCheck } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgIcon],
  template: `
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          <div class="flex flex-col items-center text-center ">
            <div
              class="w-[80px] h-[80px] rounded-full bg-[#C5C5C5] flex items-center justify-center mb-6"
            >
              <div
                class="w-[56px] h-[56px] rounded-full bg-black flex items-center text-white justify-center"
              >
                <ng-icon
                  [svg]="deliveryIcon"
                  class="[--ng-icon__size:1rem] md:[--ng-icon__size:2rem]"
                />
              </div>
            </div>
            <h3 class="font-bold text-base mb-2">FREE AND FAST DELIVERY</h3>
            <p class="text-gray-600 text-sm">Free delivery for all orders over $140</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <div
              class="w-[80px] h-[80px] rounded-full bg-[#C5C5C5] flex items-center justify-center mb-6"
            >
              <div
                class="w-[56px] h-[56px] rounded-full bg-black flex items-center text-white justify-center"
              >
                <ng-icon
                  [svg]="customerServiceIcon"
                  class="[--ng-icon__size:1rem] md:[--ng-icon__size:2rem]"
                />
              </div>
            </div>
            <h3 class="font-bold text-base mb-2">24/7 CUSTOMER SERVICE</h3>
            <p class="text-gray-600 text-sm">Friendly 24/7 customer support</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <div
              class="w-[80px] h-[80px] rounded-full bg-[#C5C5C5] flex items-center justify-center mb-6"
            >
              <div
                class="w-[56px] h-[56px] rounded-full bg-black flex items-center text-white justify-center"
              >
                <ng-icon
                  [svg]="moneyBackIcon"
                  class="[--ng-icon__size:1rem] md:[--ng-icon__size:2rem]"
                />
              </div>
            </div>
            <h3 class="font-bold text-base mb-2">MONEY BACK GUARANTEE</h3>
            <p class="text-gray-600 text-sm">We return money within 30 days</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ServicesComponent {
  readonly deliveryIcon = heroTruck;
  readonly customerServiceIcon = heroClock;
  readonly moneyBackIcon = heroShieldCheck;
}
