import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  name = '';
  email = '';
  phone = '';
  message = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  async onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_ACCESS_KEY_HERE',
          name: this.name,
          email: this.email,
          phone: this.phone,
          message: this.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.submitSuccess = true;
        this.name = '';
        this.email = '';
        this.phone = '';
        this.message = '';
      } else {
        this.submitError = true;
      }
    } catch (error) {
      this.submitError = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
