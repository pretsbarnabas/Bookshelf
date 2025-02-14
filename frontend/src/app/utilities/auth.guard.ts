import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {    

    const authService = inject(AuthService)
    const router = inject(Router);

    const path = route.routeConfig?.path;
    if (path == 'mylist' && authService.loggedInUser) {
        return ['user', 'editor', 'admin'].includes(authService.loggedInUser.role);
    }
    if (path == 'profile' && authService.loggedInUser) {
        return ['user', 'editor', 'admin'].includes(authService.loggedInUser.role);
    }
    if (path == 'auth' && localStorage.getItem('isLoggedIn') != '1') {
        return true;
    }
    router.navigate(['home']);
    return false;
};
