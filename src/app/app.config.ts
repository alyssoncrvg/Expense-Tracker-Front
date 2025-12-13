import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; 

import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ),
    
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false || 'none',
                cssLayer: {
                    name: 'primeng',
                    order: 'tailwind-base, primeng, tailwind-utilities'
                }
            }
        }
    })
  ]
};