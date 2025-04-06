import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthComponent } from '../../app/components/pages/auth/auth.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { isUserLoginModel, isUserRegistrationFormModel } from '../../app/models/User';
import { TranslationService } from '../../app/services/global/translation.service';
import { AuthService } from '../../app/services/global/auth.service';
import { FormService } from '../../app/services/page/form.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
    let component: AuthComponent;
    let fixture: ComponentFixture<AuthComponent>;

    let router: Router;
    let routeMock: { url: Subject<any> };

    let authService: AuthService;
    let translationService: TranslationService;
    let formService: FormService;

    beforeEach(async () => {
        routeMock = { url: new Subject() };

        await TestBed.configureTestingModule({
            imports: [
                AuthComponent,
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([
                    { path: 'auth/login', component: AuthComponent },
                    { path: 'auth/register', component: AuthComponent }
                ])
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                FormService,
                AuthService,
                TranslationService,
                {
                    provide: ActivatedRoute,
                    useValue: routeMock
                },
            ]
        }).compileComponents();

        translationService = TestBed.inject(TranslationService);
        authService = TestBed.inject(AuthService);
        TestBed.inject(ActivatedRoute);
        formService = TestBed.inject(FormService);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(AuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should default to login mode', fakeAsync(() => {
        spyOn(component, 'getForm').and.callThrough();
        spyOn(FormService.prototype, 'getLoginForm').and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.mode).toEqual('login');
        expect(isUserLoginModel(component.model)).toBeTrue();
        expect(component.getForm).toHaveBeenCalled();
        expect(FormService.prototype.getLoginForm).toHaveBeenCalled();
    }));

    it('Should initialize register mode on /register route', fakeAsync(() => {
        spyOn(component, 'getForm').and.callThrough();
        spyOn(FormService.prototype, 'getRegistrationForm').and.callThrough();

        routeMock.url.next([{ path: 'register' }]);
        tick();

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.mode).toEqual('register');
        expect(isUserRegistrationFormModel(component.model)).toBeTrue();
        expect(component.getForm).toHaveBeenCalled();
        expect(FormService.prototype.getRegistrationForm).toHaveBeenCalled();
    }));

    it('Should start with an empty model', fakeAsync(() => {
        routeMock.url.next([{ path: 'register' }]);
        tick();

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.model).toEqual({ username: '', email: '', passwordGroup: '' })
        expect(component.form.valid).toBeFalse();
    }));

    it('Should clear the form on clearForm()', () => {
        component.model = { username: 'test', email: 'test@test.com', passwordGroup: '123' };
        component.clearForm();
        expect(component.model).toEqual({ username: '', email: '', passwordGroup: '' });
    });


    it('Should call login from AuthService on submit', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(AuthService.prototype, 'logIn').and.returnValue(of(true));
        spyOn(component, 'logIn').and.callFake((_user): any => {
            authService.logIn(_user);
            router.navigate(['home']);
        });
        component.ngOnInit();
        component.model = { username: 'TestUser', password: '1234' };
        component.onSubmit();

        fixture.detectChanges();

        expect(component.logIn).toHaveBeenCalledWith({ username: 'TestUser', password: '1234' });
        expect(AuthService.prototype.logIn).toHaveBeenCalledWith({ username: 'TestUser', password: '1234' });
        expect(router.navigate).toHaveBeenCalledWith(['home']);
    });

    it('Should call register from AuthService on submit', fakeAsync(() => {
        routeMock.url.next([{ path: 'register' }]);
        tick();

        spyOn(AuthService.prototype, 'register').and.callThrough();
        spyOn(component, 'register').and.callFake((_model): any => {
            authService.register(_model);
        });
        component.ngOnInit();
        component.model = { username: 'TestUser', email: 'test@testing.com', passwordGroup: { password: '1234', passwordAgain: '1234' } };
        component.onSubmit();

        fixture.detectChanges();

        expect(component.register).toHaveBeenCalledWith({ username: 'TestUser', email: 'test@testing.com', password: '1234', role: 'user', image: '' });
        expect(AuthService.prototype.register).toHaveBeenCalledWith({ username: 'TestUser', email: 'test@testing.com', password: '1234', role: 'user', image: '' });
    }));
    
});
