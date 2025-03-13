import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CacheService {
    private cache = new Map<string, { response: HttpResponse<any>, expiry: number }>();
    private ttl = 5 * 60 * 1000;

    get(url: string): HttpResponse<any> | null {
        const cached = this.cache.get(url);
        if (!cached) return null;

        if (Date.now() > cached.expiry) {
            this.cache.delete(url);
            return null;
        }

        return cached.response;
    }

    set(url: string, response: HttpResponse<any>): void {
        this.cache.set(url, { response, expiry: Date.now() + this.ttl });
    }

    clear(): void {
        this.cache.clear();
    }

    clearUrl(url: string): void {
        this.cache.delete(url);
    }
}

