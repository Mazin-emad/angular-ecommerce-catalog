import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />

      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-semibold mb-6">Terms of Use</h1>

        <div class="border border-gray-200 rounded-lg p-8 space-y-6">
          <section>
            <h2 class="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p class="text-gray-600 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms
              and conditions of this agreement. If you do not agree to these terms, please do not
              use our services.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">2. Account Registration</h2>
            <p class="text-gray-600 leading-relaxed">
              When you create an account, you must provide accurate and complete information. You
              are responsible for maintaining the confidentiality of your account credentials and
              for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">3. Product Information & Pricing</h2>
            <p class="text-gray-600 leading-relaxed">
              We strive to display accurate product descriptions, images, and pricing. However, we
              do not warrant that product descriptions or other content are error-free. We reserve
              the right to correct any errors and update prices without prior notice.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">4. Orders & Payment</h2>
            <p class="text-gray-600 leading-relaxed">
              By placing an order, you agree to provide current, complete, and accurate purchase
              information. We reserve the right to refuse or cancel any order at our discretion.
              All payments are processed securely through our payment partners.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">5. Shipping & Returns</h2>
            <p class="text-gray-600 leading-relaxed">
              Shipping times and costs vary based on your location and selected shipping method.
              Our return policy allows returns within 30 days of receipt for most items. Items must
              be unused and in original packaging.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p class="text-gray-600 leading-relaxed">
              Exclusive shall not be liable for any direct, indirect, incidental, or consequential
              damages arising from your use of our website or products purchased through our
              platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class TermsComponent {
  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Terms of Use' },
  ];
}
