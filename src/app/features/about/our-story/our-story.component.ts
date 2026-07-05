import { Component } from '@angular/core';

@Component({
  selector: 'app-our-story',
  standalone: true,
  template: `
    <section class="py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <h1 class="text-4xl md:text-5xl font-semibold mb-6">Our Story</h1>
          <div class="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Launched in 2015, Exclusive is South Asia's premier online shopping
              marketplace with an active presence in Bangladesh. Supported by wide range
              of tailored marketing, data and service solutions, Exclusive has 10,500
              sellers and 300 brands and serves 3 millions customers across the region.
            </p>
            <p>
              Exclusive has more than 1 Million products to offer, growing at a very fast.
              Exclusive offers a diverse assortment in categories ranging from consumer.
            </p>
          </div>
        </div>
        <div class="relative">
          <img
            src="images/about/ourStory-image.webp"
            alt="Our Story"
            class="w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  `,
})
export class OurStoryComponent {}
