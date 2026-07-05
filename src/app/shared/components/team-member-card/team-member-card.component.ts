import { Component, input } from '@angular/core';

export interface TeamMemberSocial {
  icon: 'twitter' | 'instagram' | 'linkedin' | 'portfolio';
  url: string;
}

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  template: `
    <div class="flex flex-col">
      <div class="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] mb-4 flex items-center justify-center">
        @if (image()) {
          <img
            [src]="image()"
            [alt]="name()"
            class="w-full h-full object-cover"
          />
        } @else {
          <div class="flex flex-col items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        }
      </div>
      <h3 class="text-xl font-bold mb-1">{{ name() }}</h3>
      <p class="text-gray-500 text-sm mb-3">{{ role() }}</p>
      <div class="flex items-center gap-3">
        @for (social of socials(); track social.icon) {
          <a
            [href]="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-gray-900 transition-colors"
            [attr.aria-label]="social.icon"
          >
            @switch (social.icon) {
              @case ('twitter') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              }
              @case ('instagram') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              }
              @case ('linkedin') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              }
              @case ('portfolio') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              }
            }
          </a>
        }
      </div>
    </div>
  `,
})
export class TeamMemberCardComponent {
  name = input.required<string>();
  role = input.required<string>();
  image = input<string>();
  socials = input<TeamMemberSocial[]>([]);
}
