import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="py-8">
      <app-breadcrumb [items]="breadcrumbs" />

      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-semibold mb-6">Privacy Policy</h1>

        <div class="border border-gray-200 rounded-lg p-8 space-y-6">
          <section>
            <h2 class="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p class="text-gray-600 leading-relaxed">
              We collect information you provide directly to us, including your name, email address,
              phone number, shipping address, and payment information when you create an account,
              place an order, or contact our customer support team.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p class="text-gray-600 leading-relaxed">
              We use the information we collect to process your orders, communicate with you about
              your purchases, provide customer support, and improve our services. We may also send
              you promotional emails about new products and special offers with your consent.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">3. Data Protection</h2>
            <p class="text-gray-600 leading-relaxed">
              We implement a variety of security measures to maintain the safety of your personal
              information when you place an order or enter, submit, or access your personal
              information. Your data is stored on secure servers and encrypted during transmission.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">4. Cookies</h2>
            <p class="text-gray-600 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and
              understand where our visitors come from. You can choose to disable cookies in your
              browser settings, though this may affect certain features of our website.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">5. Third-Party Disclosure</h2>
            <p class="text-gray-600 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personally identifiable information
              to outside parties without your consent, except as required by law or to provide our
              services (e.g., payment processors, shipping carriers).
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold mb-3">6. Contact Us</h2>
            <p class="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact our support team
              through the Contact page or email us at support&#64;exclusive.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class PrivacyPolicyComponent {
  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Privacy Policy' },
  ];
}
