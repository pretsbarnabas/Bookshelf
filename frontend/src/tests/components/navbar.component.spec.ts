import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '../../app/components/layout/navbar/navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslationService } from '../../app/services/global/translation.service';
import { AuthService } from '../../app/services/global/auth.service';
import { ThemeService } from '../../app/services/global/theme.service';
import { MediaObserver } from '@angular/flex-layout';
import { Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { UserModel } from '../../app/models/User';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import MockAuthService from '../mocks/MockAuthService';

class MockThemeService {
    changeEyeSaveMode = jasmine.createSpy('changeEyeSaveMode');
    changeColorBlindnessMode = jasmine.createSpy('changeColorBlindnessMode');
    checkPreferredTheme = jasmine.createSpy('checkPreferredTheme');
    checkEyeSaverMode = jasmine.createSpy('checkEyeSaverMode');
    checkColorBlindnessMode = jasmine.createSpy('checkColorBlindnessMode');
    changeTheme = jasmine.createSpy('changeTheme');
}

class MockTranslationService {
    checkPreferred = jasmine.createSpy('checkPreferred');
    changeLanguage = jasmine.createSpy('changeLanguage');
}


describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;    
    let translationService: MockTranslationService;
    let authService: MockAuthService;
    let themeService: MockThemeService;    
    let router: Router;
    const routerEventsSubject = new Subject<RouterEvent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NavbarComponent,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                MatSidenavModule,
                MatExpansionModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AuthService, useClass: MockAuthService },
                { provide: ThemeService, useClass: MockThemeService },
                { provide: TranslationService, useClass: MockTranslationService },
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
        themeService = TestBed.inject(ThemeService) as unknown as MockThemeService;
        translationService = TestBed.inject(TranslationService) as unknown as MockTranslationService;
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should initialize preferred data values', () => {
        expect(translationService.checkPreferred).toHaveBeenCalled();
        expect(themeService.checkPreferredTheme).toHaveBeenCalled();
        expect(themeService.checkEyeSaverMode).toHaveBeenCalled();
        expect(themeService.checkColorBlindnessMode).toHaveBeenCalled();
    });

    it('Should display login buttons when not authenticated', () => {
        authService.loggedInUser$.next(null);
        fixture.detectChanges();

        const loginButton = fixture.nativeElement.querySelector('[data-test="login-button"]');
        const registerButton = fixture.nativeElement.querySelector('[data-test="register-button"]');
        expect(loginButton).toBeTruthy();
        expect(registerButton).toBeTruthy();
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

    it('Should format remaining time correctly', fakeAsync(() => {
        component.remainingTime = 125000;
        const result = component.displayRemainingTime();
        expect(result).toMatch(/\d{0,2}:\d{0,5}/);
    }));

    it('Should emit sidenavToggleClicked when toggleSideNav is called', () => {
        spyOn(component.sidenavToggleClicked, 'emit');
        component.toggleSideNav();
        expect(component.sidenavToggleClicked.emit).toHaveBeenCalled();
    });

    it('Should toggle theme when changeTheme is called', () => {
        component.currentTheme = 'light';
        component.changeTheme();
        expect(component.currentTheme).toBe('dark');
        expect(themeService.changeTheme).toHaveBeenCalledWith('dark');
    });

    it('Should change language when changeLanguage is called', () => {
        const fakeEvent = { value: 'hu' };
        component.changeLanguage(fakeEvent);
        expect(component.localizationToggleValue).toBe('hu');
        expect(translationService.changeLanguage).toHaveBeenCalledWith('hu');
    });

    it('Should toggle eye saver mode when changeEyeSaveMode is called', () => {
        component.isEyeSaveModeOn = false;
        component.changeEyeSaveMode();
        expect(component.isEyeSaveModeOn).toBeTrue();
        expect(themeService.changeEyeSaveMode).toHaveBeenCalledWith(true);
    });

    it('Should reset colorBlindnessMode to "none" when same type is passed', () => {
        component.colorBlindnessMode = 'red-green';
        component.changeColorBlindnessOverlay('red-green');
        expect(component.colorBlindnessMode).toBe('none');
    });

    it('Should change colorBlindnessMode to new type when a different type is passed', () => {
        component.colorBlindnessMode = 'none';
        component.changeColorBlindnessOverlay('blue-yellow');
        expect(component.colorBlindnessMode).toBe('blue-yellow');
        expect(themeService.changeColorBlindnessMode).toHaveBeenCalledWith('blue-yellow');        
    });
});
