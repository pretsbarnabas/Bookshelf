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
    let router: Router;

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
        router = TestBed.inject(Router);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should update user observable data', () => {
        const mockUser = { username: 'testUser', password: 'password' };
        spyOn(service, 'logIn').and.callFake((): any => {
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
        const decodedToken = { exp: Math.floor(Date.now() / 1000) + 10 };
        spyOn(service, 'decodeToken').and.returnValue(decodedToken);
        spyOn(window, 'setTimeout');

        service.scheduleAutoLogout();
        expect(window.setTimeout).toHaveBeenCalled();
    });

    it('Should logout the user', () => {
        spyOn(localStorage, 'removeItem');

        service.logOut();

        expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
        expect(router.navigate).toHaveBeenCalledWith(['home']);
    });

    it('Should return the remaining time', () => {
        const decodedToken = { exp: Math.floor(Date.now() / 1000) + 10 };
        spyOn(service, 'decodeToken').and.returnValue(decodedToken);

        const remainingTime = service.getRemainingTime();
        expect(remainingTime).toBeGreaterThan(0);
    });

    it('Should not show if lastLoggedInUser is the same', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue('testUser');
        spyOn(service, 'decodeToken').and.returnValue({ username: 'testUser' });

        const result = service.shouldGreetUser();
        expect(result).toBeNull();
    });

    it('Should show if user is fershly logged in', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue('previousUser');
        spyOn(service, 'decodeToken').and.returnValue({ username: 'testUser' });
        spyOn(sessionStorage, 'setItem');

        const result = service.shouldGreetUser();
        expect(result).toBe('testUser');
        expect(sessionStorage.setItem).toHaveBeenCalledWith('lastLoggedInUser', 'testUser');
    });

    it('Should decode token correctly', () => {
        const decodedTokenMock = { username: 'testUser', exp: Math.floor(Date.now() / 1000) + 10 };
        spyOn(localStorage, 'getItem').and.returnValue('encryptedToken');
        spyOn(service, 'decodeToken').and.returnValue(decodedTokenMock);

        const decodedToken = service.decodeToken();
        expect(decodedToken).toEqual(decodedTokenMock);

    });

    it('Should return undefined if token is invalid', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);

        const decodedToken = service.decodeToken();
        expect(decodedToken).toBeUndefined();
    })
});
