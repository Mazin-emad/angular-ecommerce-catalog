import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  email = '';

  subscribe() {
    if (this.email.trim()) {
      console.log('Subscribed:', this.email);
      this.email = '';
    }
  }
}
