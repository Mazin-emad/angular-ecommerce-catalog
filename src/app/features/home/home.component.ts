import { Component } from '@angular/core';
import { CategoriesComponent } from './categories/categories';
import { HeroBannerComponent } from './hero-banner/hero-banner';
import { ProductsComponent } from './products/products.component';
import { BrowseByCategoryComponent } from './browse-by-category/browse-by-category.component';
import { BestSellingProductsComponent } from './best-selling-products/best-selling-products.component';
import { EnhanceMusicComponent } from './enhance-music/enhance-music.component';
import { ExploreProductsComponent } from './explore-products/explore-products.component';
import { NewArrivalComponent } from './new-arrival/new-arrival.component';
import { ServicesComponent } from '../../shared/components/services/services.component';
import { BackToTopComponent } from './back-to-top/back-to-top.component';
import { Slide } from './hero-slide/hero-slide';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CategoriesComponent,
    HeroBannerComponent,
    ProductsComponent,
    BrowseByCategoryComponent,
    BestSellingProductsComponent,
    EnhanceMusicComponent,
    ExploreProductsComponent,
    NewArrivalComponent,
    ServicesComponent,
    BackToTopComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly categories = [
    { name: "Woman's Fashion", hasArrow: true, icon: 'womens' },
    { name: "Men's Fashion", hasArrow: true, icon: 'mens' },
    { name: 'Electronics', icon: 'electronics' },
    { name: 'Home & Lifestyle', icon: 'home' },
    { name: 'Medicine', icon: 'medicine' },
    { name: 'Sports & Outdoor', icon: 'sports' },
    { name: "Baby's & Toys", icon: 'babies' },
    { name: 'Groceries & Pets', icon: 'groceries' },
    { name: 'Health & Beauty', icon: 'health' },
  ];

  readonly slides: Slide[] = [
    {
      badge: 'iPhone 17 Series',
      heading: 'Up to 10% off Voucher',
      cta: 'Shop Now',
      image: 'images/home/Iphon.webp',
      icon: 'apple',
    },
    {
      badge: 'PlayStation 5',
      heading: 'Up to 20% off Voucher',
      cta: 'Shop Now',
      image: 'images/home/playstation5.webp',
      icon: 'playstation',
    },
    {
      badge: 'Gucci Perfume',
      heading: 'Up to 30% off Voucher',
      cta: 'Shop Now',
      image: 'images/home/gocci-perfum.webp',
      icon: 'gucci',
    },
  ];
}
