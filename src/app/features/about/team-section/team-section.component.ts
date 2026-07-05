import { Component, signal } from '@angular/core';
import { TeamMemberCardComponent, TeamMemberSocial } from '../../../shared/components/team-member-card/team-member-card.component';

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  socials: TeamMemberSocial[];
}

@Component({
  selector: 'app-team-section',
  standalone: true,
  imports: [TeamMemberCardComponent],
  template: `
    <section class="py-12 md:py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (member of visibleMembers(); track member.name) {
          <app-team-member-card
            [name]="member.name"
            [role]="member.role"
            [image]="member.image"
            [socials]="member.socials"
          />
        }
      </div>

      <div class="flex justify-center gap-2 mt-8">
        @for (_ of pages(); track $index) {
          <button
            (click)="goToPage($index)"
            class="w-3 h-3 rounded-full transition-colors"
            [class]="currentPage() === $index ? 'bg-[#DB4444]' : 'bg-gray-300'"
            [attr.aria-label]="'Page ' + ($index + 1)"
          ></button>
        }
      </div>
    </section>
  `,
})
export class TeamSectionComponent {
  private readonly membersPerPage = 3;
  readonly currentPage = signal(0);

  readonly allMembers: TeamMember[] = [
    {
      name: 'Mazin Emad',
      role: 'Frontend & Founder',
      image: 'images/about/mazin.webp',
      socials: [
        { icon: 'twitter', url: '#' },
        { icon: 'instagram', url: '#' },
        { icon: 'linkedin', url: '#' },
        { icon: 'portfolio', url: '#' },
      ],
    },
    {
      name: 'Esmail Mohamed',
      role: 'Backend',
      socials: [
        { icon: 'twitter', url: '#' },
        { icon: 'linkedin', url: '#' },
        { icon: 'portfolio', url: '#' },
      ],
    },
    {
      name: 'Mohamed Jehad',
      role: 'Backend',
      socials: [
        { icon: 'twitter', url: '#' },
        { icon: 'linkedin', url: '#' },
        { icon: 'portfolio', url: '#' },
      ],
    },
  ];

  readonly pages = signal<string[]>(['', '', '']);

  readonly visibleMembers = signal<TeamMember[]>(this.allMembers);

  goToPage(index: number): void {
    this.currentPage.set(index);
  }
}
