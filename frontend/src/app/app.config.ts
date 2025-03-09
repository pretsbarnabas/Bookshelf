import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from "ngx-spinner";
import { authInterceptor } from './interceptors/auth.interceptor';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { CONFIG } from './services/config.service';

export function createTranslateLoader(http: HttpClient) {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
        return new TranslateHttpLoader(http, './assets/i18n/', '.json');
    }
    return { getTranslation: () => of({}) };
}

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: CONFIG, useValue: { apiUrl: 'https://[::1]:3000' } },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor, spinnerInterceptor])
        ),
        provideClientHydration(),
        importProvidersFrom(
            TranslateModule.forRoot({
                defaultLanguage: 'en',
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient]
                }
            }),
            FlexLayoutModule.withConfig({ ssrObserveBreakpoints: ['sm', 'md'] }),
            FormlyModule.forRoot(),
            ReactiveFormsModule,
            NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
        ),
        provideAnimationsAsync(),
    ]
};
