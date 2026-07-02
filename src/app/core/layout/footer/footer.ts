import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../../shared/logo/logo';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink, LogoComponent],
  templateUrl: './footer.html',
})
export class Footer {
  readonly contact = environment.contact;
  readonly social = environment.social;

  email = '';

  subscribe() {
    if (this.email.trim()) {
      console.log('Subscribed:', this.email);
      this.email = '';
    }
  }
}
