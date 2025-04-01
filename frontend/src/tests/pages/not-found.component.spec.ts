import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from '../../app/components/pages/not-found/not-found.component';
import { TranslateModule } from '@ngx-translate/core';

describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NotFoundComponent,
                TranslateModule.forRoot()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
