import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummariesComponent } from '../../app/components/pages/summaries/summaries.component';

describe('SummariesComponent', () => {
    let component: SummariesComponent;
    let fixture: ComponentFixture<SummariesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SummariesComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SummariesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
