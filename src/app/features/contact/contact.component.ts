import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { toast } from 'ngx-sonner';

import { ContactService } from '../../core/services/contact';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  private readonly contactService = inject(ContactService);

  readonly contact = environment.contact;

  isSubmitting = false;

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Contact' },
  ];

  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', Validators.required],

    message: ['', Validators.required],
  });

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();

      toast.error('Please fill in all required fields.');

      return;
    }

    this.isSubmitting = true;

    try {
      await this.contactService.send(this.contactForm.getRawValue());

      toast.success("Message sent successfully! We'll contact you soon.");

      this.contactForm.reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
