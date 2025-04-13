import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterButtonComponent } from '../../app/components/layout/router-button/router-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router } from '@angular/router';



import { Subject } from 'rxjs';
import { provideConfig } from '../../app/services/global/config.service';

describe('RouterButtonComponent', () => {
    let component: RouterButtonComponent;
    let router: Router;
    const routerEventsSubject = new Subject();
    let fixture: ComponentFixture<RouterButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                RouterButtonComponent,
                TranslateModule.forRoot(),
            ],
            providers: [
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
        }).compileComponents();

        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(RouterButtonComponent);
        component = fixture.componentInstance;
        component.payload = { route: '/test', icon: 'test_icon', localReference: 'APP.TEST' };
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should set activated route on navigation properly', () => {
        routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));
        expect(component.activeRoute).toBe('/test');
    })
});
