import { Injectable, signal, computed } from '@angular/core';

export interface PaymentMethod {
  id: string;
  cardType: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly methodsSignal = signal<PaymentMethod[]>([
    {
      id: 'pmt-1',
      cardType: 'Visa',
      lastFour: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      cardholderName: 'John Doe',
      isDefault: true,
    },
    {
      id: 'pmt-2',
      cardType: 'Mastercard',
      lastFour: '8888',
      expiryMonth: 6,
      expiryYear: 2025,
      cardholderName: 'John Doe',
      isDefault: false,
    },
  ]);

  readonly methods = this.methodsSignal.asReadonly();
  readonly methodCount = computed(() => this.methodsSignal().length);

  getMethodById(id: string): PaymentMethod | undefined {
    return this.methodsSignal().find(m => m.id === id);
  }

  addMethod(method: Omit<PaymentMethod, 'id'>): void {
    const newMethod: PaymentMethod = {
      ...method,
      id: 'pmt-' + Date.now().toString(36),
    };
    if (newMethod.isDefault) {
      const updated = this.methodsSignal().map(m => ({ ...m, isDefault: false }));
      this.methodsSignal.set([...updated, newMethod]);
    } else {
      this.methodsSignal.set([...this.methodsSignal(), newMethod]);
    }
  }

  updateMethod(id: string, updates: Partial<PaymentMethod>): void {
    const current = this.methodsSignal();
    if (updates.isDefault) {
      const reset = current.map(m => ({ ...m, isDefault: m.id === id ? true : false }));
      const index = reset.findIndex(m => m.id === id);
      if (index >= 0) {
        const updated = [...reset];
        updated[index] = { ...updated[index], ...updates };
        this.methodsSignal.set(updated);
      }
    } else {
      const index = current.findIndex(m => m.id === id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = { ...updated[index], ...updates };
        this.methodsSignal.set(updated);
      }
    }
  }

  removeMethod(id: string): void {
    this.methodsSignal.set(this.methodsSignal().filter(m => m.id !== id));
  }
}
