import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('authToken');    

    if(token) {        
        const clonedRequest = req.clone({
            setHeaders: { Authorization: token }
            
        })
        return next(clonedRequest)
    }

    return next(req);
};
