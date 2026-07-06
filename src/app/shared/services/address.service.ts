import { Injectable, signal, computed } from '@angular/core';

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly addressesSignal = signal<Address[]>([
    {
      id: 'addr-1',
      label: 'Default Shipping Address',
      name: 'John Doe',
      street: 'Kingston, 5236',
      city: 'Kingston',
      state: 'NY',
      zip: '5236',
      country: 'United State',
      phone: '+1234567890',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Default Billing Address',
      name: 'John Doe',
      street: 'Kingston, 5236',
      city: 'Kingston',
      state: 'NY',
      zip: '5236',
      country: 'United State',
      phone: '+1234567890',
      isDefault: false,
    },
  ]);

  readonly addresses = this.addressesSignal.asReadonly();
  readonly addressCount = computed(() => this.addressesSignal().length);

  getAddressById(id: string): Address | undefined {
    return this.addressesSignal().find(a => a.id === id);
  }

  addAddress(address: Omit<Address, 'id'>): void {
    const newAddress: Address = {
      ...address,
      id: 'addr-' + Date.now().toString(36),
    };
    if (newAddress.isDefault) {
      const updated = this.addressesSignal().map(a => ({ ...a, isDefault: false }));
      this.addressesSignal.set([...updated, newAddress]);
    } else {
      this.addressesSignal.set([...this.addressesSignal(), newAddress]);
    }
  }

  updateAddress(id: string, updates: Partial<Address>): void {
    const current = this.addressesSignal();
    if (updates.isDefault) {
      const reset = current.map(a => ({ ...a, isDefault: a.id === id ? true : false }));
      const index = reset.findIndex(a => a.id === id);
      if (index >= 0) {
        const updated = [...reset];
        updated[index] = { ...updated[index], ...updates };
        this.addressesSignal.set(updated);
      }
    } else {
      const index = current.findIndex(a => a.id === id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = { ...updated[index], ...updates };
        this.addressesSignal.set(updated);
      }
    }
  }

  removeAddress(id: string): void {
    this.addressesSignal.set(this.addressesSignal().filter(a => a.id !== id));
  }
}
