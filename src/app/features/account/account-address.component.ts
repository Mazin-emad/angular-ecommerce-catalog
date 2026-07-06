import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AddressService, Address } from '../../shared/services/address.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-account-address',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent],
  template: `
    <div class="border border-gray-200 rounded-lg p-6 sm:p-10">
      <h2 class="text-[#DB4444] text-lg font-medium mb-8">Address Book</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        @for (addr of addressService.addresses(); track addr.id) {
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold">{{ addr.label }}</h3>
              @if (addr.isDefault) {
                <span class="text-xs bg-[#DB4444] text-white px-2 py-0.5 rounded">Default</span>
              }
            </div>
            <p class="text-sm text-gray-600 mb-1">{{ addr.name }}</p>
            <p class="text-sm text-gray-600 mb-1">{{ addr.street }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip }}</p>
            <p class="text-sm text-gray-600 mb-4">{{ addr.phone }}</p>
            <div class="flex gap-3">
              <button
                (click)="openEditDialog(addr)"
                class="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Edit
              </button>
              <button
                (click)="removeAddress(addr.id)"
                class="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        }
      </div>

      <button
        (click)="openAddDialog()"
        class="bg-[#DB4444] hover:bg-[#c53a3a] text-white text-sm font-medium px-6 py-3 rounded transition-colors"
      >
        Add New Address
      </button>
    </div>

    <!-- Dialog -->
    <app-dialog [open]="dialogOpen()" [title]="dialogTitle()" (close)="closeDialog()">
      <form [formGroup]="addressForm" (ngSubmit)="onSave()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              formControlName="name"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (addressForm.controls.name.invalid && addressForm.controls.name.touched) {
              <p class="text-red-500 text-xs mt-1">Name is required.</p>
            }
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phone *</label>
            <input
              type="tel"
              formControlName="phone"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (addressForm.controls.phone.invalid && addressForm.controls.phone.touched) {
              <p class="text-red-500 text-xs mt-1">Phone is required.</p>
            }
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Street Address *</label>
          <input
            type="text"
            formControlName="street"
            class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          />
          @if (addressForm.controls.street.invalid && addressForm.controls.street.touched) {
            <p class="text-red-500 text-xs mt-1">Street address is required.</p>
          }
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">City *</label>
            <input
              type="text"
              formControlName="city"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (addressForm.controls.city.invalid && addressForm.controls.city.touched) {
              <p class="text-red-500 text-xs mt-1">City is required.</p>
            }
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              formControlName="state"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Zip</label>
            <input
              type="text"
              formControlName="zip"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Country *</label>
          <input
            type="text"
            formControlName="country"
            class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          />
          @if (addressForm.controls.country.invalid && addressForm.controls.country.touched) {
            <p class="text-red-500 text-xs mt-1">Country is required.</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            formControlName="label"
            placeholder="e.g. Home, Office"
            class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          />
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" formControlName="isDefault" id="addr-default" class="accent-[#DB4444]" />
          <label for="addr-default" class="text-sm">Set as default</label>
        </div>
        <div class="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            (click)="closeDialog()"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="isSaving"
            class="bg-[#DB4444] hover:bg-[#c53a3a] text-white text-sm font-medium px-6 py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </app-dialog>
  `,
})
export class AccountAddressComponent {
  readonly addressService = inject(AddressService);
  private readonly fb = inject(FormBuilder);

  dialogOpen = signal(false);
  dialogTitle = signal('');
  editingId = signal<string | null>(null);
  isSaving = false;

  addressForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: [''],
    zip: [''],
    country: ['', Validators.required],
    label: [''],
    isDefault: [false],
  });

  openAddDialog(): void {
    this.editingId.set(null);
    this.dialogTitle.set('Add New Address');
    this.addressForm.reset({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      label: '',
      isDefault: false,
    });
    this.dialogOpen.set(true);
  }

  openEditDialog(addr: Address): void {
    this.editingId.set(addr.id);
    this.dialogTitle.set('Edit Address');
    this.addressForm.patchValue({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      label: addr.label,
      isDefault: addr.isDefault,
    });
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
  }

  async onSave(): Promise<void> {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    await new Promise(r => setTimeout(r, 400));

    const val = this.addressForm.getRawValue();
    const data = { ...val, isDefault: val.isDefault ?? false, label: val.label || (this.editingId() ? 'Address' : 'New Address') };

    try {
      if (this.editingId()) {
        this.addressService.updateAddress(this.editingId()!, data);
        toast.success('Address updated successfully.');
      } else {
        this.addressService.addAddress(data);
        toast.success('Address added successfully.');
      }
      this.closeDialog();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      this.isSaving = false;
    }
  }

  removeAddress(id: string): void {
    this.addressService.removeAddress(id);
    toast.success('Address removed.');
  }
}
