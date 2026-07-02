import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/" [class]="classes">El DoKan</a>
  `,
})
export class LogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get classes(): string {
    const base = 'font-bold shrink-0';
    const sizes = {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
    };
    return `${base} ${sizes[this.size]}`;
  }
}
