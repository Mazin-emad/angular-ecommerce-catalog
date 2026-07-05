import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgIcon],
  template: `
    <div
      class="group flex flex-col items-center justify-center py-8 px-4 rounded-lg border transition-all duration-300 border-gray-200 bg-white hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] cursor-default"
    >
      <div
        class="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-100 group-hover:bg-white/20 transition-all duration-300"
      >
        <ng-icon
          [svg]="icon()"
          class="[--ng-icon__size:1.5rem] text-black group-hover:text-white transition-colors duration-300"
        />
      </div>
      <span class="text-3xl font-bold mb-1 text-gray-900 group-hover:text-white transition-colors duration-300">{{ value() }}</span>
      <span
        class="text-sm text-center text-gray-500 group-hover:text-white/90 transition-colors duration-300"
      >
        {{ label() }}
      </span>
    </div>
  `,
})
export class StatCardComponent {
  icon = input.required<string>();
  value = input.required<string>();
  label = input.required<string>();
}
