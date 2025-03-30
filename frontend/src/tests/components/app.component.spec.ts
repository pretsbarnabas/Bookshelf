import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserModel } from '../../app/models/User';
import { AppComponent } from '../../app/components/layout/app.component';
import { AuthService } from '../../app/services/global/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
    loggedInUser$ = new Subject<UserModel | null>();
    remainingTime$ = new Subject<number>();
    setLoggedInUser = jasmine.createSpy('setLoggedInUser');
    logOut = jasmine.createSpy('logOut');
}

describe('AppComponent tests', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;    
    let authService: MockAuthService;
    let router: Router;
    const routerEventsSubject = new Subject<RouterEvent>();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                AppComponent,
                BrowserAnimationsModule,
                MatSidenavModule,
                MatExpansionModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AuthService, useClass: MockAuthService },
                {
                    provide: Router, useValue: {
                        events: routerEventsSubject.asObservable(),
                        routerState: { root: {} },
                        url: '/',
                        navigate: jasmine.createSpy('navigate')
                    }
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
        
        authService = TestBed.inject(AuthService) as unknown as MockAuthService;        
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('Should initialize with user data', () => {
        expect(authService.setLoggedInUser).toHaveBeenCalled();
    });

    it('Should show/hide spinner on navigation events', () => {
        spyOn(NgxSpinnerService.prototype, 'show').and.callThrough();
        spyOn(NgxSpinnerService.prototype, 'hide').and.callThrough();

        routerEventsSubject.next(new NavigationStart(1, '/test'));        
        expect(NgxSpinnerService.prototype.show).toHaveBeenCalled();

        routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));
        expect(NgxSpinnerService.prototype.hide).toHaveBeenCalled();
    });

    it('Should update user data when auth service emits', () => {
        const testUser = { username: 'test', role: 'user' } as UserModel;
        authService.loggedInUser$.next(testUser);
        expect(component.loggedInUser).toEqual(testUser);
    });

    it('Should display admin button for admin users', () => {
        const adminUser = { username: 'admin', role: 'admin' } as UserModel;
        authService.loggedInUser$.next(adminUser);
        fixture.detectChanges();

        const adminButton = fixture.nativeElement.querySelector('[data-test="admin-button"]');
        expect(adminButton).toBeTruthy();
    });

    it('Should display login buttons when not authenticated', () => {
        authService.loggedInUser$.next(null);
        fixture.detectChanges();

        const loginButton = fixture.nativeElement.querySelector('[data-test="login-button"]');
        const registerButton = fixture.nativeElement.querySelector('[data-test="register-button"]');
        expect(loginButton).toBeTruthy();
        expect(registerButton).toBeTruthy();
    });

    it('Should format remaining time correctly', fakeAsync(() => {
        component.remainingTime = 125000;
        const result = component.displayRemainingTime();
        expect(result).toMatch(/\d{0,2}:\d{0,5}/);
    }));
});