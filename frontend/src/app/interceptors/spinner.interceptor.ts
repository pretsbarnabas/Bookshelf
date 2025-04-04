import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
    const spinner = inject(NgxSpinnerService);

    const excludedRoutes = [
        /\/auth\/refreshToken/,
        /\/api\/reviews\/[^\/]+\/like/,
    ];

    const shouldSkipSpinner = excludedRoutes.some((pattern: RegExp) =>
        pattern.test(req.url)
    );

    if (!shouldSkipSpinner) {
        spinner.show();
    }

    return next(req).pipe(
        finalize(() => {
            if (!shouldSkipSpinner) {
                spinner.hide();
            }
        })
    );
};
