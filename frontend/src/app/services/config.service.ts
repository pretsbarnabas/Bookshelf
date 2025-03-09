import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, PLATFORM_ID, Provider } from '@angular/core';

declare global {
    interface Window {
        __APP_CONFIG__: Record<string, any>;
    }
}

export const CONFIG = new InjectionToken<Record<string, any>>('CONFIG');

@Injectable({
    providedIn: 'root',
})
export class ConfigService {

    constructor(
        @Inject(CONFIG) private config: any,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    get(key: string): any {
        if(isPlatformBrowser(this.platformId)) {
            // Client-side specific logic
            return this.config[key] || window.__APP_CONFIG__[key];
        }
        // Server-side fallback
        return this.config[key];
    }
}

export function provideConfig(config: Record<string, any>): Provider {
    return { provide: CONFIG, useValue: config };
}
