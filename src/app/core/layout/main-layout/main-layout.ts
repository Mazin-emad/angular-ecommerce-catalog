import { Component } from '@angular/core';
import { AnnouncementBar } from '../announcement-bar/announcement-bar';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [AnnouncementBar, Footer, Header, RouterOutlet],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
