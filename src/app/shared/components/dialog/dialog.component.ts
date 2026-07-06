import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 transition-opacity"
          (click)="close.emit()"
        ></div>
        <!-- Panel -->
        <div
          class="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-dialog-in"
        >
          @if (title()) {
            <h2 class="text-lg font-semibold mb-6">{{ title() }}</h2>
          }
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes dialog-in {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-dialog-in {
      animation: dialog-in 0.2s ease-out;
    }
  `,
})
export class DialogComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly close = output<void>();
}
