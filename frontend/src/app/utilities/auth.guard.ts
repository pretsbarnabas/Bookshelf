import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap } from 'rxjs';
import { UserLoggedInModel } from '../models/User';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    let userRole: string | null = null;

    if (isPlatformBrowser(platformId)) {
        if (localStorage.getItem('authToken'))
            userRole = authService.decodeToken().role;
    }

    if (state.url.startsWith('/auth')) {
        if (!userRole) {
            return of(true);
        } else {
            router.navigate(['home']);
        }
    }
    if (['/mylist', '/profile'].some((protectedRoute) => state.url.startsWith(protectedRoute))) {
        if (userRole && ['user', 'editor', 'admin'].includes(userRole)) {
            return of(true);
        } else {
            router.navigate(['auth/login']);
        }
    }
    return of(false);


};
