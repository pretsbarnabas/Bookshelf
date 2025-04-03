import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { authInterceptor } from './interceptors/auth.interceptor';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { cacheInterceptor } from './interceptors/cache.interceptor';
import { CustomTitleStrategy } from './utilities/custom.title.strategy';
import { provideNativeDateAdapter } from '@angular/material/core';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

function isMobile(): boolean {
    return window.innerWidth < 400;
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useClass: CustomTitleStrategy },
        provideHttpClient(withFetch(),
            withInterceptors([
                authInterceptor,
                cacheInterceptor,
                spinnerInterceptor,
            ])
        ),
        importProvidersFrom(
            TranslateModule.forRoot({
                defaultLanguage: 'en',
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient]
                }
            }),
            FormlyModule.forRoot(),
            ReactiveFormsModule,
            NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })            
        ),
        provideNativeDateAdapter(),
        isMobile() ? provideNoopAnimations() : provideAnimationsAsync()
    ]
};
