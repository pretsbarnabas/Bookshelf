import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/global/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('authToken');
    const router = inject(Router);
    const authService = inject(AuthService);

    if (token) {
        try {
            const decoded: any = authService.decodeToken();
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('authToken');
                router.navigate(['auth/login']);
                return next(req);
            }

            const clonedRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });

            return next(clonedRequest);
        } catch (error) {
            authService.logOut();
            router.navigate(['auth/login']);
            return next(req);
        }
    }

    return next(req);
};
