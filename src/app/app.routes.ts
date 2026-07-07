import { Routes } from '@angular/router';

import { ProductDetailsComponent } from './features/product-details/product-details/product-details.component';
import { ProductListComponent } from './features/product-list/product-list/product-list.component';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ContactComponent } from './features/contact/contact.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AboutComponent } from './features/about/about.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsComponent } from './features/terms/terms.component';
import { FaqComponent } from './features/faq/faq.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AccountComponent } from './features/account/account.component';
import { AdminLayout } from './features/admin/layouts/admin-layout';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminDashboardComponent } from './features/admin/pages/dashboard/dashboard.component';
import { AdminProductsComponent } from './features/admin/pages/products/products.component';
import { AdminOrdersComponent } from './features/admin/pages/orders/orders.component';
import { AdminUsersComponent } from './features/admin/pages/users/users.component';
import { AdminCategoriesComponent } from './features/admin/pages/categories/categories.component';
import { AdminSettingsComponent } from './features/admin/pages/settings/settings.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ],
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'about', component: AboutComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'account', component: AccountComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
