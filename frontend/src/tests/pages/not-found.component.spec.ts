import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NotFoundComponent } from '../../app/components/pages/not-found/not-found.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../app/components/pages/home/home.component';

describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NotFoundComponent,
                TranslateModule.forRoot()
            ]
        }).compileComponents();

        router = TestBed.inject(Router);

        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should initialize with the correct data', () => {
        expect(component.currentTime).toEqual(20);
        expect(component.spinnerValue).toEqual(100);
        expect(component.exchangeRate).toEqual(5);
    });

    it('Should start countdown', fakeAsync(() => {
        component.startCountDown();
        tick(5000);
        expect(component.currentTime).toEqual(15);

        tick(5000);
        expect(component.currentTime).toEqual(10);
    }));

    it('should navigate to home when countdown reaches zero', fakeAsync(() => {
        spyOn(router, 'navigate');

        component.ngOnInit();
        fixture.detectChanges();
        component.startCountDown();
        tick(20000);

        expect(component.currentTime).toBe(0);
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));
});
