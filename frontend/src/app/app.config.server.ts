import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from "ngx-spinner";
import { authInterceptor } from './interceptors/auth.interceptor';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { provideServerRendering } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { CONFIG } from './services/config.service';

export const serverConfig: ApplicationConfig = {
    providers: [
        { provide: CONFIG, useValue: { apiUrl: 'https://[::1]:3000' } },
        provideServerRendering(),
        provideRouter(routes),
        provideHttpClient(withFetch(),
            withInterceptors([
                authInterceptor,
                spinnerInterceptor
            ])
        ),
        importProvidersFrom(
            TranslateModule.forRoot({
                defaultLanguage: 'en'
            }),
            FlexLayoutServerModule,
            FormlyModule.forRoot(),
            ReactiveFormsModule,
            NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
        ),
        provideAnimationsAsync(),
    ]
};
