import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />

      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-semibold mb-6">Frequently Asked Questions</h1>

        <div class="border border-gray-200 rounded-lg divide-y divide-gray-200">
          <details class="group p-6 open:bg-gray-50 transition-colors">
            <summary class="flex items-center justify-between cursor-pointer font-medium text-base">
              How do I place an order?
              <svg class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-4 text-gray-600 leading-relaxed">
              Browse our catalog, select the items you want, add them to your cart, and proceed
              to checkout. You'll need to create an account or log in, enter your shipping
              information, and choose a payment method to complete your order.
            </p>
          </details>

          <details class="group p-6 open:bg-gray-50 transition-colors">
            <summary class="flex items-center justify-between cursor-pointer font-medium text-base">
              What payment methods do you accept?
              <svg class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-4 text-gray-600 leading-relaxed">
              We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All
              transactions are processed securely through encrypted payment gateways.
            </p>
          </details>

          <details class="group p-6 open:bg-gray-50 transition-colors">
            <summary class="flex items-center justify-between cursor-pointer font-medium text-base">
              How long does shipping take?
              <svg class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-4 text-gray-600 leading-relaxed">
              Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.
              International shipping may take 10-15 business days depending on the destination.
              Free shipping is available on orders over $140.
            </p>
          </details>

          <details class="group p-6 open:bg-gray-50 transition-colors">
            <summary class="flex items-center justify-between cursor-pointer font-medium text-base">
              What is your return policy?
              <svg class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-4 text-gray-600 leading-relaxed">
              We offer a 30-day return policy for most items. Products must be unused and in their
              original packaging. To initiate a return, please contact our customer support team
              through the Contact page.
            </p>
          </details>

          <details class="group p-6 open:bg-gray-50 transition-colors">
            <summary class="flex items-center justify-between cursor-pointer font-medium text-base">
              How can I track my order?
              <svg class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-4 text-gray-600 leading-relaxed">
              Once your order is shipped, you will receive a confirmation email with a tracking
              number. You can use this number to track your package on our website or the
              carrier's website.
            </p>
          </details>

          <details class="group p-6 open:bg-gray-50 transition-colors">
            <summary class="flex items-center justify-between cursor-pointer font-medium text-base">
              Can I cancel or modify my order?
              <svg class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-4 text-gray-600 leading-relaxed">
              Orders can be canceled or modified within 1 hour of placement. After that, the order
              enters processing and cannot be changed. Please contact our support team as soon as
              possible if you need to make changes.
            </p>
          </details>
        </div>
      </div>
    </div>
  `,
})
export class FaqComponent {
  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'FAQ' },
  ];
}
