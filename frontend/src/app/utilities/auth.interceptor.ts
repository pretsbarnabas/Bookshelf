import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);

    const token = localStorage.getItem('authToken');    

    if(token) {        
        const clonedRequest = req.clone({
            setHeaders: { Authorization: token }
            
        })
        return next(clonedRequest)
    }

    return next(req);
};
