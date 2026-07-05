import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface BillingDetails {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface OrderResponse {
  orderId: string;
  status: 'confirmed' | 'failed';
  message: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly isPlacingOrder = signal(false);
  readonly isPlacing = this.isPlacingOrder.asReadonly();

  placeOrder(
    billingDetails: BillingDetails,
    paymentMethod: string,
  ): Observable<OrderResponse> {
    this.isPlacingOrder.set(true);

    const response: OrderResponse = {
      orderId: 'ORD-' + Date.now().toString(36).toUpperCase(),
      status: 'confirmed',
      message: 'Your order has been placed successfully!',
      createdAt: new Date(),
    };

    return of(response).pipe(
      delay(1500),
    );
  }

  reset(): void {
    this.isPlacingOrder.set(false);
  }
}
