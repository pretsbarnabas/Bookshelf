import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('authToken');
    const router = inject(Router);

    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp && decoded.exp < currentTime) {
                console.warn('Token expired, logging out...');
                localStorage.removeItem('authToken');
                router.navigate(['auth/login']);
                return next(req);
            }

            const clonedRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });

            return next(clonedRequest);
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('authToken');
            router.navigate(['auth/login']);
            return next(req);
        }
    }

    return next(req);
};
