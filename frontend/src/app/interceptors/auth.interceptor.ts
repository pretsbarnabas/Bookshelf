import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('authToken');

        if (token) {
            const clonedRequest = req.clone({
                setHeaders: { Authorization: token }
            });
            return next(clonedRequest);
        }
    }

    return next(req); // Server-side requests pass through without modification
};
