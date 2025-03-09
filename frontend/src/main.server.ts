import 'zone.js';
import '@angular/compiler';
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/components/layout/app.component';
import { serverConfig } from './app/app.config.server';

export const bootstrapApp = async (url: string) => {
    return renderApplication(
        () => bootstrapApplication(AppComponent, serverConfig),
        {
            document: '<app-root></app-root>',
            url,            
            platformProviders: [
                { provide: 'CLIENT_HYDRATION', useFactory: provideClientHydration },
                { provide: 'SERVER_CONTEXT', useValue: 'ssr'},
                { provide: 'REQUEST_URL', useValue: url },
                { provide: 'SERVER_REQUEST_TIMEOUT', useValue: 30000 }
            ]
        }
    );
};
