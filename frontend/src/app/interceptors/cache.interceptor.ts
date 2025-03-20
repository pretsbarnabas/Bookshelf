import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { CacheService } from '../services/global/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    const cacheService = inject(CacheService);

    if (req.method !== 'GET') {
        cacheService.clearUrl(req.url);
        return next(req);
    }

    const cachedResponse = cacheService.get(req.url);
    if (cachedResponse) {
        const lastUpdated = cachedResponse.body?.updated_at;

        if (lastUpdated) {
            return next(req).pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        const newUpdatedAt = (event.body as any).updated_at;

                        if (newUpdatedAt && new Date(newUpdatedAt) > new Date(lastUpdated)) {
                            cacheService.set(req.url, event);
                        }
                    }
                }),
                startWith(cachedResponse)
            );
        }
        // console.log('cached response loaded');
        return of(cachedResponse);
    }

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                cacheService.set(req.url, event);
            }
        })
    );
};


