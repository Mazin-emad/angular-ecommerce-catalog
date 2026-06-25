import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.scss',
})
export class AnnouncementBar implements OnInit {
  announcementMessage: string = '';
  selectedLanguage: string = 'en';

  languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
  ];

  ngOnInit() {
    this.announcementMessage = this.calcAnnouncementMessage();
  }

  onLanguageChange() {
    toast.warning(this.languages.find(l => l.code === this.selectedLanguage)?.name + ' is not a supported yet.');
    // TODO: from Mazin: hook this up to translation/i18n service
  }

  private calcAnnouncementMessage(): string {
    const month = new Date().getMonth(); // 0 = Jan ... 11 = Dec

    const isSummer = month >= 5 && month <= 7; // Jun, Jul, Aug
    const isWinter = month === 11 || month === 0 || month === 1; // Dec, Jan, Feb

    if (isSummer) {
      return 'Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!';
    }

    if (isWinter) {
      return 'Winter Sale - Stay Warm With OFF 40% On All Jackets And Free Delivery!';
    }

    return 'Welcome! Stay Ready For Sales And Discounts.';
  }
}
