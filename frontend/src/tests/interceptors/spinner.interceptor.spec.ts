import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { spinnerInterceptor } from '../../app/interceptors/spinner.interceptor';

describe('spinnerInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => spinnerInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});
