import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { startWith, tap } from 'rxjs/operators';
import { CacheService } from '../services/global/cache.service';
import { of } from 'rxjs';

function getLatestUpdatedAt(data: any[]): Date | null {
    if (!Array.isArray(data) || data.length === 0) return null;
    let latest = new Date(data[0].updated_at);
    for (const item of data) {
        if (item.updated_at) {
            const d = new Date(item.updated_at);
            if (d > latest) {
                latest = d;
            }
        }
    }
    return latest;
}

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    const cacheService = inject(CacheService);

    if (req.method !== 'GET') {
        cacheService.clearUrl(req.url);
        return next(req);
    }

    const cachedResponse = cacheService.get(req.url);
    if (cachedResponse) {
        const cachedData = cachedResponse.body?.data;
        const cachedSize = Array.isArray(cachedData) ? cachedData.length : null;
        const cachedLatest = getLatestUpdatedAt(cachedData);

        return next(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    const newData = (event.body as any)?.data;
                    const newSize = Array.isArray(newData) ? newData.length : null;
                    const newLatest = getLatestUpdatedAt(newData);

                    if (
                        (newSize !== cachedSize) ||
                        (newLatest && cachedLatest && newLatest > cachedLatest) ||
                        (newLatest && !cachedLatest)
                    ) {
                        cacheService.set(req.url, event);
                    }
                }
            }),
            startWith(cachedResponse),
            // tap(val => {
            //     if (val === cachedResponse) {
            //         console.log("Emitting cached response:", val);
            //     }
            // })
        );
    }

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                cacheService.set(req.url, event);
            }
        })
    );
};
