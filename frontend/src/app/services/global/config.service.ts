import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';

export const CONFIG = new InjectionToken<Record<string, any>>('CONFIG');

@Injectable({
    providedIn: 'root',
})
export class ConfigService {

    constructor(
        @Inject(CONFIG) private config: Record<string, any>
    ) { }

    get(key: string): any {
        return this.config[key];
    }
}

export function provideConfig(config: Record<string, any>): Provider {
    return { provide: CONFIG, useValue: config };
}
