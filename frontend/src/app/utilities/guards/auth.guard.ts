import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/global/auth.service';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    let userRole: string | null = null;
    if (localStorage.getItem('authToken'))
        userRole = authService.decodeToken().role;

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
    if (state.url.startsWith('/admin'))
        if (!userRole)
            router.navigate(['auth/login']);
        else if (userRole && userRole == 'admin')
            return of(true);
        else
            router.navigate(['home']);
    return of(false);
};
