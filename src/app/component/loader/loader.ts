import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center h-64 w-full p-8 rounded-lg bg-white/50 backdrop-blur-sm">
      <p-progressSpinner 
        ariaLabel="loading" 
        class="w-12 h-12" 
        strokeWidth="4" 
        animationDuration=".5s">
      </p-progressSpinner>
      
      @if (message) {
        <p class="mt-4 text-gray-600 font-medium animate-pulse">{{ message }}</p>
      }
    </div>
  `
})
export class LoaderComponent {
  @Input() message: string = 'Carregando...';
}