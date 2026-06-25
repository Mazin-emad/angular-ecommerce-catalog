import { Routes } from '@angular/router';

import { ProductDetailsComponent } from './features/product-details/product-details/product-details.component';
import { ProductListComponent } from './features/product-list/product-list/product-list.component';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'wishlist', component: WishlistComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];