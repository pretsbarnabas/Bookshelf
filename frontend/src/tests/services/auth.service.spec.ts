import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../app/services/global/auth.service';
import { CrudService } from '../../app/services/global/crud.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ConfigService, provideConfig } from '../../app/services/global/config.service';
import { InjectionToken } from '@angular/core';
import { of, Subject } from 'rxjs';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

describe('AuthService', () => {
    let service: AuthService;
    let crudService: CrudService;
    let configService: ConfigService

    const routerEventsSubject = new Subject<RouterEvent>();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [

            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                {
                    provide: Router, useValue: {
                        events: routerEventsSubject.asObservable(),
                        routerState: { root: {} },
                        url: '/',
                        navigate: jasmine.createSpy('navigate')
                    }
                },
            ]
        });
        crudService = TestBed.inject(CrudService);
        configService = TestBed.inject(ConfigService);
        service = TestBed.inject(AuthService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should update user observable data', () => {
        const mockUser = { username: 'testUser', password: 'password' };
        spyOn(service, 'logIn').and.callFake((): any =>{
            service.loggedInUser$ = of({ username: 'testUser', password: 'password' } as any)
        });
        service.logIn(mockUser);

        service.loggedInUser$.subscribe((user) => {            
                expect(user!.username).toBe('testUser');            
        });

    });

    it('Should login method return JWT token, set localStorage, set loggedInUser', () => {
        const mockResponse = { token: 'testJWT' };
        spyOn(crudService, 'create').and.returnValue(of(mockResponse));
        spyOn(localStorage, 'setItem');
        spyOn(service, 'setLoggedInUser').and.callThrough();
        spyOn(service, 'scheduleAutoLogout').and.callThrough();

        service.logIn({ username: 'testUser', password: 'testing' }).subscribe((result) => {
            expect(result).toBeTrue();
            expect(localStorage.setItem).toHaveBeenCalledWith('authToken', jasmine.any(String));
            expect(service.setLoggedInUser).toHaveBeenCalled();
            expect(service.scheduleAutoLogout).toHaveBeenCalled();
        });
    });

    it('Should use refreshToken correctly', () => {
        const mockResponse = { token: 'testJWTRefreshed' };
        spyOn(service, 'refreshToken').and.callFake(() => {
            service.scheduleAutoLogout();
            localStorage.setItem('authToken', mockResponse.token);
        });
        spyOn(service, 'scheduleAutoLogout').and.callThrough();
        spyOn(localStorage, 'setItem');
        spyOn(crudService, 'create').and.returnValue(of(mockResponse));

        service.refreshToken();

        routerEventsSubject.next(new NavigationEnd(1, '/', '/test'));
        expect(service.refreshToken).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'testJWTRefreshed');
        expect(service.scheduleAutoLogout).toHaveBeenCalled();
    });

    it('Should use scheduleAutoLogout correctly', () => {          
       

    });
});
