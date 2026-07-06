import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { PaymentService, PaymentMethod } from '../../shared/services/payment.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-account-payment',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent],
  template: `
    <div class="border border-gray-200 rounded-lg p-6 sm:p-10">
      <h2 class="text-[#DB4444] text-lg font-medium mb-8">My Payment Options</h2>

      <div class="space-y-4 mb-8">
        @for (method of paymentService.methods(); track method.id) {
          <div class="flex items-center justify-between border border-gray-200 rounded-lg p-5">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                [class.bg-blue-600]="method.cardType === 'Visa'"
                [class.bg-gray-800]="method.cardType === 'Mastercard'"
                [class.bg-orange-500]="method.cardType !== 'Visa' && method.cardType !== 'Mastercard'"
              >
                {{ method.cardType === 'Mastercard' ? 'MC' : method.cardType.substring(0, 4).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-medium">{{ method.cardType }} ending in {{ method.lastFour }}</p>
                <p class="text-xs text-gray-500">Expires {{ method.expiryMonth }}/{{ method.expiryYear }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              @if (method.isDefault) {
                <span class="text-xs bg-[#DB4444] text-white px-2 py-0.5 rounded">Default</span>
              } @else {
                <button
                  (click)="setDefault(method.id)"
                  class="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Set as Default
                </button>
              }
              <button
                (click)="openEditDialog(method)"
                class="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Edit
              </button>
              <button
                (click)="removeMethod(method.id)"
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
        Add New Card
      </button>
    </div>

    <!-- Dialog -->
    <app-dialog [open]="dialogOpen()" [title]="dialogTitle()" (close)="closeDialog()">
      <form [formGroup]="paymentForm" (ngSubmit)="onSave()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Cardholder Name *</label>
            <input
              type="text"
              formControlName="cardholderName"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            />
            @if (paymentForm.controls.cardholderName.invalid && paymentForm.controls.cardholderName.touched) {
              <p class="text-red-500 text-xs mt-1">Name is required.</p>
            }
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Card Type *</label>
            <select
              formControlName="cardType"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">American Express</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Card Number (last 4 digits) *</label>
          <input
            type="text"
            formControlName="lastFour"
            maxlength="4"
            placeholder="Last 4 digits"
            class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          />
          @if (paymentForm.controls.lastFour.invalid && paymentForm.controls.lastFour.touched) {
            <p class="text-red-500 text-xs mt-1">Enter the last 4 digits.</p>
          }
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Expiry Month *</label>
            <select
              formControlName="expiryMonth"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              @for (m of [1,2,3,4,5,6,7,8,9,10,11,12]; track m) {
                <option [value]="m">{{ m }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Expiry Year *</label>
            <select
              formControlName="expiryYear"
              class="w-full px-3 py-2 bg-[#F5F5F5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              @for (y of years; track y) {
                <option [value]="y">{{ y }}</option>
              }
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" formControlName="isDefault" id="pmt-default" class="accent-[#DB4444]" />
          <label for="pmt-default" class="text-sm">Set as default</label>
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
export class AccountPaymentComponent {
  readonly paymentService = inject(PaymentService);
  private readonly fb = inject(FormBuilder);

  readonly years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  dialogOpen = signal(false);
  dialogTitle = signal('');
  editingId = signal<string | null>(null);
  isSaving = false;

  paymentForm = this.fb.nonNullable.group({
    cardholderName: ['', Validators.required],
    cardType: ['Visa', Validators.required],
    lastFour: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    expiryMonth: [12, Validators.required],
    expiryYear: [new Date().getFullYear() + 1, Validators.required],
    isDefault: [false],
  });

  openAddDialog(): void {
    this.editingId.set(null);
    this.dialogTitle.set('Add New Card');
    this.paymentForm.reset({
      cardholderName: '',
      cardType: 'Visa',
      lastFour: '',
      expiryMonth: 12,
      expiryYear: new Date().getFullYear() + 1,
      isDefault: false,
    });
    this.dialogOpen.set(true);
  }

  openEditDialog(method: PaymentMethod): void {
    this.editingId.set(method.id);
    this.dialogTitle.set('Edit Card');
    this.paymentForm.patchValue({
      cardholderName: method.cardholderName,
      cardType: method.cardType,
      lastFour: method.lastFour,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      isDefault: method.isDefault,
    });
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
  }

  setDefault(id: string): void {
    this.paymentService.updateMethod(id, { isDefault: true });
    toast.success('Default payment method updated.');
  }

  async onSave(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    await new Promise(r => setTimeout(r, 400));

    const val = this.paymentForm.getRawValue();

    try {
      if (this.editingId()) {
        this.paymentService.updateMethod(this.editingId()!, { ...val, isDefault: val.isDefault ?? false });
        toast.success('Card updated successfully.');
      } else {
        this.paymentService.addMethod({ ...val, isDefault: val.isDefault ?? false });
        toast.success('Card added successfully.');
      }
      this.closeDialog();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      this.isSaving = false;
    }
  }

  removeMethod(id: string): void {
    this.paymentService.removeMethod(id);
    toast.success('Card removed.');
  }
}
